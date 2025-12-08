export interface DirectMessageCreateDto {
  receiverId: string;
  message: string;
}

export interface DirectMessageCreateResultDto {
  id: number;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string; // ISO string
  isRead: boolean;
}

export interface DirectMessageConversationDto {
  id: number;
  senderId: string;
  senderUsername: string;
  senderProfileImageUrl?: string;
  receiverId: string;
  receiverUsername: string;
  receiverProfileImageUrl?: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface InboxMessageDto {
  id: number;
  senderId: string;
  senderUsername: string;
  senderProfileImageUrl?: string;
  message: string;
  timestamp: string;
  unreadCount: number;
}

export interface UnreadCountDto {
  unreadCount: number;
}

export interface SignalRReceivedMessage {
  id: number;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface SignalRMessageSent {
  id: number;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface SignalRMessageRead {
  messageId: number;
  timestamp: string;
}

export interface SignalRMessageReadByRecipient {
  messageId: number;
  readBy: string;
  readByUsername: string;
  timestamp: string;
}
