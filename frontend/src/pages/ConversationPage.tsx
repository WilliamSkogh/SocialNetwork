import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { directMessageService } from '../services/DirectMessageService';
import { useDirectMessageSignalR } from '../hooks/useDirectMessageSignalR';
import type { DirectMessageConversationDto } from '../types/DirectMessage';
import config from '../config';

const API_BASE_URL = config.apiBaseUrl;

const ConversationPage = () => {
  const { userId: otherUserId } = useParams<{ userId: string }>();
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

  const {
    sendMessage: sendViaSignalR,
    notifyTyping,
    notifyStoppedTyping,
    markAsRead,
    isConnected
  } = useDirectMessageSignalR({
    onMessageReceived: (message) => {
      if (message.senderId === otherUserId || message.receiverId === otherUserId) {
        setMessages(prev => {
          const senderProfileImageUrl = prev.find(m => m.senderId === message.senderId)?.senderProfileImageUrl;
          const receiverProfileImageUrl = prev.find(m => m.receiverId === message.receiverId)?.receiverProfileImageUrl;
          
          const newMessages = [...prev, {
            id: message.id,
            senderId: message.senderId,
            senderUsername: '',
            senderProfileImageUrl,
            receiverId: message.receiverId,
            receiverUsername: '',
            receiverProfileImageUrl,
            message: message.message,
            timestamp: message.timestamp,
            isRead: message.isRead
          }];
          return newMessages.sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });
        scrollToBottom();
        
        if (message.senderId === otherUserId && !message.isRead) {
          markAsRead(message.id).catch(err => 
            console.error('Failed to auto-mark message as read:', err)
          );
        }
      }
    },
    onMessageSent: (confirmation) => {
      setMessages(prev => {
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
          isRead: confirmation.isRead
        }];
        return newMessages.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });
      scrollToBottom();
    },
    onUserTyping: (senderId) => {
      if (senderId === otherUserId) {
        setTypingUserId(senderId);
        setTimeout(() => {
          setTypingUserId(prev => prev === senderId ? null : prev);
        }, 3000);
      }
    },
    onUserStoppedTyping: (senderId) => {
      if (senderId === otherUserId) {
        setTypingUserId(null);
      }
    },
    onMessageRead: (notification) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === notification.messageId ? { ...msg, isRead: true } : msg
        )
      );
    },
    onMessageReadByRecipient: (notification) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === notification.messageId ? { ...msg, isRead: true } : msg
        )
      );
    },
    autoConnect: false
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async () => {
    if (!otherUserId) return;
    
    try {
      setLoading(true);
      const data = await directMessageService.getConversation(otherUserId);
      setMessages(data);
      scrollToBottom();
      markUnreadMessagesAsRead(data);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  const otherUserName = messages.length > 0
    ? (messages[0].senderId === otherUserId 
        ? messages[0].senderUsername 
        : messages[0].receiverUsername)
    : 'Användare';

  const otherUserProfileImageUrl = messages.length > 0
    ? (messages[0].senderId === otherUserId 
        ? messages[0].senderProfileImageUrl 
        : messages[0].receiverProfileImageUrl)
    : undefined;

  const markUnreadMessagesAsRead = async (msgs: typeof messages) => {
    if (!user || !otherUserId) return;
    
    const unreadMessages = msgs.filter(
      msg => !msg.isRead && msg.senderId === otherUserId && msg.receiverId === user.id
    );
    
    for (const msg of unreadMessages) {
      try {
        if (isConnected()) {
          await markAsRead(msg.id);
        }
      } catch (err) {
        console.error('Failed to mark message as read:', msg.id, err);
      }
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadConversation();
  }, [otherUserId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
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
      notifyStoppedTyping(otherUserId);
      isTypingRef.current = false;
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Kunde inte skicka meddelande');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    if (!otherUserId || !isConnected()) return;
    
    if (!isTypingRef.current) {
      notifyTyping(otherUserId);
      isTypingRef.current = true;
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      notifyStoppedTyping(otherUserId);
      isTypingRef.current = false;
    }, 3000);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Laddar konversation...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      maxWidth: '1000px',
      margin: '0 auto',
      paddingTop: '60px'
    }}>
      <div style={{
        padding: '15px 20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        flexShrink: 0
      }}>
        <button
          onClick={() => navigate('/messages')}
          style={{
            padding: '8px 15px',
            backgroundColor: 'transparent',
            border: '1px solid #dee2e6',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Tillbaka
        </button>
        
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#6c757d',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            flexShrink: 0,
            overflow: 'hidden',
            backgroundImage: otherUserProfileImageUrl 
              ? `url(${API_BASE_URL}${otherUserProfileImageUrl})` 
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {!otherUserProfileImageUrl && (otherUserName?.charAt(0).toUpperCase() || '?')}
        </div>
        
        <div>
          <h2 style={{ margin: 0, fontSize: '18px' }}>{otherUserName}</h2>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#6c757d' }}>
          {isConnected() ? (
            <span style={{ color: 'green' }}>● Ansluten</span>
          ) : (
            <span style={{ color: 'orange' }}>● Ansluter...</span>
          )}
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: '#ffffff',
        minHeight: 0
      }}>
        {messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#6c757d'
          }}>
            <p>Inga meddelanden än. Skicka det första meddelandet!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.senderId === user.id;
            const displayName = isOwnMessage ? user.username : msg.senderUsername;
            const profileImageUrl = isOwnMessage ? user.profileImageUrl : msg.senderProfileImageUrl;
            
            return (
              <div
                key={msg.id}
                style={{
                  marginBottom: '15px',
                  display: 'flex',
                  flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                  gap: '10px',
                  alignItems: 'flex-start'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    flexShrink: 0,
                    overflow: 'hidden',
                    backgroundImage: profileImageUrl 
                      ? `url(${API_BASE_URL}${profileImageUrl})` 
                      : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!profileImageUrl && (displayName?.charAt(0).toUpperCase() || '?')}
                </div>

                <div style={{ maxWidth: '70%' }}>
                  {!isOwnMessage && (
                    <div style={{
                      fontSize: '12px',
                      color: '#6c757d',
                      marginBottom: '4px',
                      marginLeft: '4px'
                    }}>
                      {displayName}
                    </div>
                  )}
                  
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: isOwnMessage ? '#0d6efd' : '#e9ecef',
                      color: isOwnMessage ? 'white' : 'black'
                    }}
                  >
                    <div style={{ marginBottom: '5px' }}>{msg.message}</div>
                    <div style={{
                      fontSize: '11px',
                      opacity: 0.8,
                      textAlign: 'right',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '5px'
                    }}>
                      {new Date(msg.timestamp).toLocaleTimeString('sv-SE', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {isOwnMessage && (
                        <span>
                          {msg.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {typingUserId === otherUserId && (
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
            marginBottom: '15px'
          }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#6c757d',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                flexShrink: 0,
                overflow: 'hidden',
                backgroundImage: otherUserProfileImageUrl 
                  ? `url(${API_BASE_URL}${otherUserProfileImageUrl})` 
                  : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!otherUserProfileImageUrl && (otherUserName?.charAt(0).toUpperCase() || '?')}
            </div>
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: '#e9ecef',
              color: '#6c757d',
              fontStyle: 'italic'
            }}>
              skriver...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        style={{
          padding: '15px 20px',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #dee2e6',
          display: 'flex',
          gap: '10px',
          flexShrink: 0
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Skriv ett meddelande..."
          disabled={sending}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none'
          }}
          autoFocus
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          style={{
            padding: '12px 24px',
            backgroundColor: newMessage.trim() && !sending ? '#0d6efd' : '#dee2e6',
            color: newMessage.trim() && !sending ? 'white' : '#6c757d',
            border: 'none',
            borderRadius: '8px',
            cursor: newMessage.trim() && !sending ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          {sending ? 'Skickar...' : 'Skicka'}
        </button>
      </form>
    </div>
  );
};

export default ConversationPage;
