
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { directMessageService } from '../services/directMessage/DirectMessageService';
import { useDirectMessageSignalR } from './useDirectMessageSignalR';
import type { DirectMessageConversationDto, SignalRMessageSent } from '../types/DirectMessage';

export const useConversation = (otherUserId: string | undefined) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<DirectMessageConversationDto[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | undefined>(undefined);
  const isTypingRef = useRef<boolean>(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const onMessageReceived = useCallback((message: DirectMessageConversationDto) => {
    // Only process incoming messages from the other user
    if (message.senderId === otherUserId) {
      setMessages(prev => {
        // Prevent adding a message if it already exists
        if (prev.some(m => m.id === message.id)) {
          return prev;
        }

        const senderProfileImageUrl = prev.find(m => m.senderId === message.senderId)?.senderProfileImageUrl;
        const receiverProfileImageUrl = prev.find(m => m.receiverId === message.receiverId)?.receiverProfileImageUrl;
        
        const newMessages = [...prev, {
          ...message,
          senderUsername: '',
          receiverUsername: '',
          senderProfileImageUrl,
          receiverProfileImageUrl,
        }];
        return newMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      });
      scrollToBottom();
      
      if (!message.isRead) {
        markAsRead(message.id).catch(err =>
          console.error('Failed to auto-mark message as read:', err)
        );
      }
    }
  }, [otherUserId, scrollToBottom]);

  const onMessageSent = useCallback((confirmation: SignalRMessageSent) => {
    setMessages(prev => {
      // Prevent adding a message if it already exists
      if (prev.some(m => m.id === confirmation.id)) {
        return prev;
      }
      
      const otherUser = prev.find(m => m.senderId === otherUserId || m.receiverId === otherUserId);
      const receiverProfileImageUrl = otherUser?.senderId === otherUserId
        ? otherUser?.senderProfileImageUrl
        : otherUser?.receiverProfileImageUrl;
      
      const newMessages = [...prev, {
        id: confirmation.id,
        senderId: user!.id,
        senderUsername: user!.username,
        senderProfileImageUrl: user!.profileImageUrl,
        receiverId: confirmation.receiverId,
        receiverUsername: '',
        receiverProfileImageUrl,
        message: confirmation.message,
        timestamp: confirmation.timestamp,
        isRead: confirmation.isRead,
      }];
      return newMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    });
    scrollToBottom();
  }, [otherUserId, user, scrollToBottom]);

  const onUserTyping = useCallback((senderId: string) => {
    if (senderId === otherUserId) {
      setTypingUserId(senderId);
     
    }
  }, [otherUserId]);

  const onUserStoppedTyping = useCallback((senderId: string) => {
    if (senderId === otherUserId) {
      setTypingUserId(null);
    }
  }, [otherUserId]);

  const onMessageRead = useCallback((notification: { messageId: number }) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === notification.messageId ? { ...msg, isRead: true } : msg
      )
    );
  }, []);

  const {
    sendMessage: sendViaSignalR,
    notifyTyping: notifyTypingViaSignalR,
    notifyStoppedTyping: notifyStoppedTypingViaSignalR,
    markAsRead,
    isConnected
  } = useDirectMessageSignalR({
    onMessageReceived,
    onMessageSent,
    onUserTyping,
    onUserStoppedTyping,
    onMessageRead,
    onMessageReadByRecipient: onMessageRead,
    autoConnect: false
  });

  const markUnreadMessagesAsRead = useCallback(async (msgs: DirectMessageConversationDto[]) => {
    if (!user || !otherUserId || !isConnected()) return;
    
    const unreadMessages = msgs.filter(
      msg => !msg.isRead && msg.senderId === otherUserId && msg.receiverId === user.id
    );
    
    for (const msg of unreadMessages) {
      try {
        await markAsRead(msg.id);
      } catch (err) {
        console.error('Failed to mark message as read:', msg.id, err);
      }
    }
  }, [user, otherUserId]);

  const loadConversation = useCallback(async () => {
    if (!otherUserId) return;
    
    try {
      setLoading(true);
      const data = await directMessageService.getConversation(otherUserId);
      setMessages(data);
      markUnreadMessagesAsRead(data);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
    finally {
      setLoading(false);
    }
  }, [otherUserId, markUnreadMessagesAsRead]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadConversation();
  }, [otherUserId, user, navigate, loadConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherUserId || !user) return;
    
    setSending(true);
    
    try {
      if (isConnected()) {
        await sendViaSignalR(otherUserId, newMessage);
      } else {
        await directMessageService.sendMessage(otherUserId, newMessage);
        await loadConversation();
      }
      
      setNewMessage('');
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isConnected()) {
        notifyStoppedTypingViaSignalR(otherUserId);
      }
      isTypingRef.current = false;
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Kunde inte skicka meddelande');
    }
    finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    if (!otherUserId || !isConnected()) return;
    
    if (!isTypingRef.current) {
      notifyTypingViaSignalR(otherUserId);
      isTypingRef.current = true;
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = window.setTimeout(() => {
      notifyStoppedTypingViaSignalR(otherUserId);
      isTypingRef.current = false;
    }, 1000);
  };
  
  const otherUserDetails = messages.length > 0
    ? (messages[0].senderId === otherUserId
        ? { name: messages[0].senderUsername, profileImageUrl: messages[0].senderProfileImageUrl }
        : { name: messages[0].receiverUsername, profileImageUrl: messages[0].receiverProfileImageUrl })
    : { name: 'User', profileImageUrl: undefined };

  return {
    user,
    messages,
    newMessage,
    setNewMessage,
    loading,
    sending,
    typingUserId,
    messagesEndRef,
    sendMessage,
    handleTyping,
    otherUserDetails,
  };
};
