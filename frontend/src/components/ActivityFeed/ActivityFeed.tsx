import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/axiosClient';
import { buildMediaUrl } from '../../utils/media';
import './ActivityFeed.css';

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
        if (a.type === 'follow') {
            navigate(`/profile/${a.actorUsername}`);
        } else if (a.postId) {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(`post-${a.postId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    };

    const getMediaThumbnail = (url?: string) => {
        if (!url) return null;
        const fullUrl = buildMediaUrl(url);
        if (!fullUrl) return null;

        const isVideo = url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm');
        
        if (isVideo) {
            return (
                <div style={{ position: 'relative', width: 40, height: 40, marginLeft: 8 }}>
                    <video 
                        src={fullUrl} 
                        style={{ width: 40, height: 40, objectFit: 'cover' }}
                        muted
                    />
                    <i className="bi bi-play-circle-fill" style={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)',
                        color: 'black',
                        fontSize: '20px',
                        pointerEvents: 'none'
                    }}></i>
                </div>
            );
        }
        
        return (
            <img 
                src={fullUrl} 
                alt="" 
                style={{ width: 40, height: 40, marginLeft: 8, objectFit: 'cover' }} 
            />
        );
    };

    return (
        <div className="activity-feed">
            <h3>Aktivitet</h3>
            {activities.length === 0 ? (
                <p>Inga aktiviteter</p>
            ) : (
                <div>
                    {activities.map((a, i) => (
                        <div key={i} onClick={() => handleClick(a)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {a.actorProfileImageUrl && (
                                <img 
                                    src={buildMediaUrl(a.actorProfileImageUrl)} 
                                    alt="" 
                                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} 
                                />
                            )}
                            <div style={{ flex: 1 }}>
                                <span>{getText(a)}</span>
                                <span> - {getTime(a.createdAt)}</span>
                            </div>
                            {getMediaThumbnail(a.postImageUrl)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
