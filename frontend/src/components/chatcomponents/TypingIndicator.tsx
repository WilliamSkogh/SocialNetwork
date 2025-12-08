
import config from '../../config';

const API_BASE_URL = config.apiBaseUrl;

interface TypingIndicatorProps {
    otherUserName: string;
    otherUserProfileImageUrl?: string;
}

const TypingIndicator = ({ otherUserName, otherUserProfileImageUrl }: TypingIndicatorProps) => {
    return (
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
    );
};

export default TypingIndicator;
