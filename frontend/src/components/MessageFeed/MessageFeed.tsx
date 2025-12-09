import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { directMessageService } from '../../services/directMessage/DirectMessageService';
import { useDirectMessageSignalR } from '../../hooks/useDirectMessageSignalR';
import type { InboxMessageDto } from '../../types/DirectMessage';
import { buildMediaUrl } from '../../utils/media';
import '../../styles/MessageFeed.css';

export default function MessageFeed() {
    const [conversations, setConversations] = useState<InboxMessageDto[]>([]);
    const navigate = useNavigate();

    useDirectMessageSignalR({
        onMessageReceived: () => {
            loadInbox();
        },
        autoConnect: false
    });

    const loadInbox = () => {
        directMessageService.getInbox()
            .then(data => {
                setConversations(data);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        loadInbox();
    }, []);

    const getTime = (dateString: string) => {
        const now = new Date();
        const messageDate = new Date(dateString);
        const diffMs = now.getTime() - messageDate.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 60) return 'just nu';
        if (diffMins < 60) return `${diffMins}min sedan`;
        if (diffHours < 24) return `${diffHours}h sedan`;
        if (diffDays < 7) return `${diffDays}d sedan`;
        return messageDate.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
    };

    const handleClick = (conv: InboxMessageDto) => {
        navigate(`/messages/${conv.senderId}`);
    };

    return (
        <div className="message-feed">
            <div className="message-feed-header">
                <h3 className="message-feed-title">Meddelanden</h3>
            </div>
            {conversations.length === 0 ? (
                <div className="message-feed-empty">
                    Inga konversationer än
                </div>
            ) : (
                <div>
                    {conversations.map((conv) => (
                        <div 
                            key={conv.id} 
                            onClick={() => handleClick(conv)} 
                            className={`message-item ${conv.unreadCount > 0 ? 'unread' : ''}`}
                        >
                            {conv.senderProfileImageUrl ? (
                                <img 
                                    src={buildMediaUrl(conv.senderProfileImageUrl)} 
                                    alt="" 
                                    className="message-profile-image"
                                />
                            ) : (
                                <div className="message-profile-image placeholder">
                                    <i className="bi bi-person-fill"></i>
                                </div>
                            )}
                            <div className="message-content">
                                <div className="message-text">
                                    <span className="message-username">
                                        {conv.senderUsername}
                                    </span>
                                    <span className="message-preview">
                                        {conv.message.length > 35 
                                            ? `${conv.message.substring(0, 35)}...` 
                                            : conv.message}
                                    </span>
                                </div>
                                <div className="message-time">
                                    {getTime(conv.timestamp)}
                                </div>
                            </div>
                            {conv.unreadCount > 0 && (
                                <div className="message-unread-badge">
                                    {conv.unreadCount}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
