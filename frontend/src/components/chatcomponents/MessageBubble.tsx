
import type { DirectMessageConversationDto } from '../../types/DirectMessage';
import type { User } from '../../AuthContext';
import config from '../../config';

const API_BASE_URL = config.apiBaseUrl;

interface MessageBubbleProps {
  msg: DirectMessageConversationDto;
  isOwnMessage: boolean;
  user: User;
}

const MessageBubble = ({ msg, isOwnMessage, user }: MessageBubbleProps) => {
  const displayName = isOwnMessage ? user.username : msg.senderUsername;
  const profileImageUrl = isOwnMessage ? user.profileImageUrl : msg.senderProfileImageUrl;

  return (
    <div
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
};

export default MessageBubble;
