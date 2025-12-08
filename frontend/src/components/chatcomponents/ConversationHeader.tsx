
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const API_BASE_URL = config.apiBaseUrl;

interface ConversationHeaderProps {
  otherUserName: string;
  otherUserProfileImageUrl?: string;
}

const ConversationHeader = ({ otherUserName, otherUserProfileImageUrl }: ConversationHeaderProps) => {
  const navigate = useNavigate();

  return (
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
    </div>
  );
};

export default ConversationHeader;
