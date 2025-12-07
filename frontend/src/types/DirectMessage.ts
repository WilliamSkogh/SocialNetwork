// src/types/DirectMessage.ts

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
  receiverId: string;
  receiverUsername: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface InboxMessageDto {
  id: number;
  senderId: string;
  senderUsername: string;
  message: string;
  timestamp: string;
  unreadCount: number;
}

export interface UnreadCountDto {
  unreadCount: number;
}
