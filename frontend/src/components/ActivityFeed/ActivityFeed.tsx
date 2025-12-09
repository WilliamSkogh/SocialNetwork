import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/axiosClient';
import { buildMediaUrl } from '../../utils/media';
import '../../styles/ActivityFeed.css';

interface Activity {
    type: 'like' | 'dislike' | 'comment' | 'follow';
    actorUsername: string;
    actorProfileImageUrl?: string;
    postId?: number;
    postImageUrl?: string;
    createdAt: string;
    commentText?: string;
}

export default function ActivityFeed() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.get('/api/activities')
            .then(res => setActivities(res.data))
            .catch(err => console.error(err));
    }, []);

    const getTime = (dateString: string) => {
        const now = new Date();
        const activityDate = new Date(dateString);
        const diffMs = now.getTime() - activityDate.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 60) return 'just nu';
        if (diffMins < 60) return `${diffMins}min sedan`;
        if (diffHours < 24) return `${diffHours}h sedan`;
        if (diffDays < 7) return `${diffDays}d sedan`;
        return activityDate.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
    };

    const getText = (a: Activity) => {
        if (a.type === 'like') return `${a.actorUsername} gillade ditt inlägg`;
        if (a.type === 'dislike') return `${a.actorUsername} tummade ner ditt inlägg`;
        if (a.type === 'comment') return `${a.actorUsername} kommenterade ditt inlägg`;
        if (a.type === 'follow') return `${a.actorUsername} följer dig`;
        return '';
    };

    const handleClick = (a: Activity) => {
        if (a.postId) {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(`post-${a.postId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    };

    const handleProfileClick = (e: React.MouseEvent, username: string) => {
        e.stopPropagation();
        navigate(`/profile/${username}`);
    };

    const getMediaThumbnail = (url?: string) => {
        if (!url) return null;
        const fullUrl = buildMediaUrl(url);
        if (!fullUrl) return null;

        const isVideo = url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm');
        
        if (isVideo) {
            return (
                <div className="activity-video-container">
                    <video 
                        src={fullUrl} 
                        muted
                    />
                    <i className="bi bi-play-circle-fill activity-video-icon"></i>
                </div>
            );
        }
        
        return (
            <img 
                src={fullUrl} 
                alt="" 
                className="activity-thumbnail"
            />
        );
    };

    return (
        <div className="activity-feed">
            <div className="activity-feed-header">
                <h3 className="activity-feed-title">Aktivitet</h3>
            </div>
            {activities.length === 0 ? (
                <div className="activity-feed-empty">
                    Inga aktiviteter än
                </div>
            ) : (
                <div>
                    {activities.map((a, i) => (
                        <div 
                            key={i} 
                            onClick={() => handleClick(a)} 
                            className="activity-item"
                        >
                            {a.actorProfileImageUrl && (
                                <img 
                                    src={buildMediaUrl(a.actorProfileImageUrl)} 
                                    alt="" 
                                    onClick={(e) => handleProfileClick(e, a.actorUsername)}
                                    className="activity-profile-image"
                                />
                            )}
                            <div className="activity-content">
                                <div className="activity-text">
                                    <span 
                                        onClick={(e) => handleProfileClick(e, a.actorUsername)}
                                        className="activity-username"
                                    >
                                        {a.actorUsername}
                                    </span>
                                    <span>
                                        {' '}{getText(a).substring(a.actorUsername.length)}
                                    </span>
                                </div>
                                <div className="activity-time">
                                    {getTime(a.createdAt)}
                                </div>
                            </div>
                            {getMediaThumbnail(a.postImageUrl)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
