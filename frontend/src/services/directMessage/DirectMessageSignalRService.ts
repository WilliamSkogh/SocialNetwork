import * as signalR from '@microsoft/signalr';
import config from '../../config';

export interface ReceivedMessage {
  id: number;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface SentMessageConfirmation {
  id: number;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface MessageReadNotification {
  messageId: number;
  timestamp: string;
}

export interface MessageReadByRecipient {
  messageId: number;
  readBy: string;
  readByUsername: string;
  timestamp: string;
}

export type MessageHandler = (message: ReceivedMessage) => void;
export type MessageSentHandler = (confirmation: SentMessageConfirmation) => void;
export type TypingHandler = (senderId: string) => void;
export type MessageReadHandler = (notification: MessageReadNotification) => void;
export type MessageReadByRecipientHandler = (notification: MessageReadByRecipient) => void;
export type ErrorHandler = (error: string) => void;

class DirectMessageSignalRService {
  private connection: signalR.HubConnection | null = null;
  private token: string | null = null;
  private isConnecting: boolean = false;

  private messageHandlers: MessageHandler[] = [];
  private messageSentHandlers: MessageSentHandler[] = [];
  private typingHandlers: TypingHandler[] = [];
  private stoppedTypingHandlers: TypingHandler[] = [];
  private messageReadHandlers: MessageReadHandler[] = [];
  private messageReadByRecipientHandlers: MessageReadByRecipientHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];

  constructor() {
    this.token = localStorage.getItem('accessToken');
  }

  /**
   * Start SignalR connection
   */
  async startConnection(token?: string): Promise<void> {
    if (token) {
      this.token = token;
    }

    if (!this.token) {
      throw new Error('No authentication token available');
    }

    console.log('🔑 Token available:', this.token ? 'Yes (length: ' + this.token.length + ')' : 'No');
    console.log('🌐 Connecting to:', `${config.apiBaseUrl}/hubs/direct-messages`);

    // Prevent multiple simultaneous connection attempts
    if (this.isConnecting) {
      console.log('⚠️ Connection attempt already in progress, waiting...');
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log('✅ SignalR already connected');
      return;
    }

    if (this.connection) {
      console.log('🧹 Cleaning up previous connection...');
      try {
        await this.connection.stop();
      } catch (err) {
        console.log('Error stopping previous connection:', err);
      }
      this.connection = null;
    }

    this.isConnecting = true;

    try {
      console.log('🔧 Building SignalR connection...');
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${config.apiBaseUrl}/hubs/direct-messages`, {
          accessTokenFactory: () => {
            console.log('🔐 Providing token to SignalR...');
            return this.token || '';
          },
          skipNegotiation: false,
          logger: {
            log: (logLevel: signalR.LogLevel, message: string) => {
              if (logLevel >= signalR.LogLevel.Warning) {
                console.error(`[SignalR ${signalR.LogLevel[logLevel]}]`, message);
              } else {
                console.log(`[SignalR ${signalR.LogLevel[logLevel]}]`, message);
              }
            }
          }
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext: signalR.RetryContext) => {
            if (retryContext.previousRetryCount === 0) return 0;
            if (retryContext.previousRetryCount === 1) return 2000;
            if (retryContext.previousRetryCount === 2) return 10000;
            return 30000;
          }
        })
        .configureLogging(signalR.LogLevel.Trace)
        .build();

      console.log('✅ Connection builder complete');

      this.registerHandlers();
      console.log('✅ Event handlers registered');

      await this.connection.start();
      console.log('✅ SignalR connected successfully');

      this.connection.onreconnecting((error?: Error) => {
        console.log('SignalR reconnecting...', error);
      });

      this.connection.onreconnected((connectionId?: string) => {
        console.log('SignalR reconnected', connectionId);
      });

      this.connection.onclose((error?: Error) => {
        console.log('SignalR connection closed', error);
        this.isConnecting = false;
      });

      this.isConnecting = false;
    } catch (error) {
      console.error('❌ SignalR connection error:', error);
      this.isConnecting = false;
      this.connection = null;
      throw error;
    }
  }

  /**
   * Stop SignalR connection
   */
  async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.log('SignalR connection stopped');
    }
  }

  /**
   * Register all SignalR event handlers
   */
  private registerHandlers(): void {
    if (!this.connection) return;

    this.connection.on('ReceiveDirectMessage', (message: ReceivedMessage) => {
      console.log('Received message:', message);
      this.messageHandlers.forEach(handler => handler(message));
    });

    this.connection.on('MessageSent', (confirmation: SentMessageConfirmation) => {
      console.log('Message sent confirmation:', confirmation);
      this.messageSentHandlers.forEach(handler => handler(confirmation));
    });

    this.connection.on('UserIsTyping', (senderId: string) => {
      this.typingHandlers.forEach(handler => handler(senderId));
    });

    this.connection.on('UserStoppedTyping', (senderId: string) => {
      this.stoppedTypingHandlers.forEach(handler => handler(senderId));
    });

    this.connection.on('MessageMarkedAsRead', (notification: MessageReadNotification) => {
      console.log('Message marked as read:', notification);
      this.messageReadHandlers.forEach(handler => handler(notification));
    });

    this.connection.on('MessageReadByRecipient', (notification: MessageReadByRecipient) => {
      console.log('Message read by recipient:', notification);
      this.messageReadByRecipientHandlers.forEach(handler => handler(notification));
    });

    this.connection.on('Error', (error: string) => {
      console.error('SignalR error:', error);
      this.errorHandlers.forEach(handler => handler(error));
    });
  }

  /**
   * Send a direct message
   */
  async sendMessage(receiverId: string, message: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR not connected');
    }

    await this.connection.invoke('SendDirectMessage', receiverId, message);
  }

  /**
   * Notify typing status
   */
  async notifyTyping(receiverId: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    await this.connection.invoke('UserTyping', receiverId);
  }

  /**
   * Notify stopped typing
   */
  async notifyStoppedTyping(receiverId: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    await this.connection.invoke('UserStoppedTyping', receiverId);
  }

  /**
   * Mark message as read
   */
  async markMessageAsRead(messageId: number): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR not connected');
    }

    await this.connection.invoke('MarkMessageAsRead', messageId);
  }

  /**
   * Get latest message ID between two users
   */
  async getLatestMessageId(userId1: string, userId2: string): Promise<number> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR not connected');
    }

    return await this.connection.invoke<number>('GetLatestDirectMessageIdBetweenUsers', userId1, userId2);
  }

  onMessageReceived(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onMessageSent(handler: MessageSentHandler): () => void {
    this.messageSentHandlers.push(handler);
    return () => {
      this.messageSentHandlers = this.messageSentHandlers.filter(h => h !== handler);
    };
  }

  onUserTyping(handler: TypingHandler): () => void {
    this.typingHandlers.push(handler);
    return () => {
      this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
    };
  }

  onUserStoppedTyping(handler: TypingHandler): () => void {
    this.stoppedTypingHandlers.push(handler);
    return () => {
      this.stoppedTypingHandlers = this.stoppedTypingHandlers.filter(h => h !== handler);
    };
  }

  onMessageRead(handler: MessageReadHandler): () => void {
    this.messageReadHandlers.push(handler);
    return () => {
      this.messageReadHandlers = this.messageReadHandlers.filter(h => h !== handler);
    };
  }

  onMessageReadByRecipient(handler: MessageReadByRecipientHandler): () => void {
    this.messageReadByRecipientHandlers.push(handler);
    return () => {
      this.messageReadByRecipientHandlers = this.messageReadByRecipientHandlers.filter(h => h !== handler);
    };
  }

  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.push(handler);
    return () => {
      this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
    };
  }

  /**
   * Get connection state
   */
  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const directMessageSignalR = new DirectMessageSignalRService();
export default directMessageSignalR;
