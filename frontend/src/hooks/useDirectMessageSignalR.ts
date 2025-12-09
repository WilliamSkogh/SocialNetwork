import { useEffect, useCallback } from 'react';
import directMessageSignalR, {
  type ReceivedMessage,
  type SentMessageConfirmation,
  type MessageReadNotification,
  type MessageReadByRecipient,
} from '../services/directMessage/DirectMessageSignalRService';

export interface UseDirectMessageSignalROptions {
  onMessageReceived?: (message: ReceivedMessage) => void;
  onMessageSent?: (confirmation: SentMessageConfirmation) => void;
  onUserTyping?: (senderId: string) => void;
  onUserStoppedTyping?: (senderId: string) => void;
  onMessageRead?: (notification: MessageReadNotification) => void;
  onMessageReadByRecipient?: (notification: MessageReadByRecipient) => void;
  onError?: (error: string) => void;
  autoConnect?: boolean;
}

export const useDirectMessageSignalR = (options: UseDirectMessageSignalROptions = {}) => {
  const {
    onMessageReceived,
    onMessageSent,
    onUserTyping,
    onUserStoppedTyping,
    onMessageRead,
    onMessageReadByRecipient,
    onError,
    autoConnect = true,
  } = options;

  
  const connect = useCallback(async (token?: string) => {
    if (directMessageSignalR.isConnected()) {
      console.log('Already connected to SignalR');
      return;
    }

    try {
      await directMessageSignalR.startConnection(token);
      console.log('Connected to DirectMessage SignalR hub');
    } catch (error) {
      console.error('Failed to connect to SignalR:', error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(async () => {
    await directMessageSignalR.stopConnection();
  }, []);

  const sendMessage = useCallback(async (receiverId: string, message: string) => {
    try {
      await directMessageSignalR.sendMessage(receiverId, message);
    } catch (error) {
      console.error('Failed to send message via SignalR:', error);
      throw error;
    }
  }, []);


  const notifyTyping = useCallback(async (receiverId: string) => {
    try {
      await directMessageSignalR.notifyTyping(receiverId);
    } catch (error) {
      console.error('Failed to notify typing:', error);
    }
  }, []);


  const notifyStoppedTyping = useCallback(async (receiverId: string) => {
    try {
      await directMessageSignalR.notifyStoppedTyping(receiverId);
    } catch (error) {
      console.error('Failed to notify stopped typing:', error);
    }
  }, []);


  const markAsRead = useCallback(async (messageId: number) => {
    try {
      await directMessageSignalR.markMessageAsRead(messageId);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      throw error;
    }
  }, []);

  const getLatestMessageId = useCallback(async (userId1: string, userId2: string) => {
    try {
      return await directMessageSignalR.getLatestMessageId(userId1, userId2);
    } catch (error) {
      console.error('Failed to get latest message ID:', error);
      throw error;
    }
  }, []);


  const getConnectionState = useCallback(() => {
    return directMessageSignalR.getConnectionState();
  }, []);

  const isConnected = useCallback(() => {
    return directMessageSignalR.isConnected();
  }, []);

  useEffect(() => {
    const unsubscribers: Array<() => void> = [];

    if (onMessageReceived) {
      unsubscribers.push(directMessageSignalR.onMessageReceived(onMessageReceived));
    }

    if (onMessageSent) {
      unsubscribers.push(directMessageSignalR.onMessageSent(onMessageSent));
    }

    if (onUserTyping) {
      unsubscribers.push(directMessageSignalR.onUserTyping(onUserTyping));
    }

    if (onUserStoppedTyping) {
      unsubscribers.push(directMessageSignalR.onUserStoppedTyping(onUserStoppedTyping));
    }

    if (onMessageRead) {
      unsubscribers.push(directMessageSignalR.onMessageRead(onMessageRead));
    }

    if (onMessageReadByRecipient) {
      unsubscribers.push(directMessageSignalR.onMessageReadByRecipient(onMessageReadByRecipient));
    }

    if (onError) {
      unsubscribers.push(directMessageSignalR.onError(onError));
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [
    onMessageReceived,
    onMessageSent,
    onUserTyping,
    onUserStoppedTyping,
    onMessageRead,
    onMessageReadByRecipient,
    onError,
  ]);

  useEffect(() => {
    if (autoConnect) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        connect(token).catch(console.error);
      }
    }

    return () => {
      if (autoConnect) {
        disconnect().catch(console.error);
      }
    };
  }, [autoConnect, connect, disconnect]);

  return {
    connect,
    disconnect,
    sendMessage,
    notifyTyping,
    notifyStoppedTyping,
    markAsRead,
    getLatestMessageId,
    getConnectionState,
    isConnected,
  };
};

export default useDirectMessageSignalR;
