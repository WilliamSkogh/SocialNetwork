import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { directMessageService } from '../services/DirectMessageService';
import type { InboxMessageDto } from '../types/DirectMessage';
import { useDirectMessageSignalR } from '../hooks/useDirectMessageSignalR';
import config from '../config';

const API_BASE_URL = config.apiBaseUrl;

const MessagesPage = () => {
  const [conversations, setConversations] = useState<InboxMessageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useDirectMessageSignalR({
    onMessageReceived: () => {
      loadInbox();
    },
    autoConnect: false
  });

  const loadInbox = async () => {
    try {
      setLoading(true);
      const data = await directMessageService.getInbox();
      setConversations(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load inbox:', err);
      setError('Kunde inte ladda meddelanden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInbox();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Laddar meddelanden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <p>{error}</p>
        <button onClick={loadInbox}>Försök igen</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Meddelanden</h1>
      
      {conversations.length === 0 ? (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <p style={{ color: '#6c757d' }}>Inga meddelanden än</p>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => navigate(`/messages/${conversation.senderId}`)}
              style={{
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  overflow: 'hidden',
                  backgroundImage: conversation.senderProfileImageUrl 
                    ? `url(${API_BASE_URL}${conversation.senderProfileImageUrl})` 
                    : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!conversation.senderProfileImageUrl && (conversation.senderUsername?.charAt(0).toUpperCase() || '?')}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontWeight: conversation.unreadCount > 0 ? 'bold' : 'normal',
                  marginBottom: '5px',
                  fontSize: '16px'
                }}>
                  {conversation.senderUsername}
                </div>
                <div style={{ 
                  color: '#6c757d', 
                  fontSize: '14px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {conversation.message}
                </div>
                <div style={{ 
                  color: '#adb5bd', 
                  fontSize: '12px',
                  marginTop: '5px'
                }}>
                  {new Date(conversation.timestamp).toLocaleString('sv-SE')}
                </div>
              </div>
              
              {conversation.unreadCount > 0 && (
                <div style={{
                  backgroundColor: '#0d6efd',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {conversation.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
