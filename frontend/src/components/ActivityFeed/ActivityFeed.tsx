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
                <div style={{ position: 'relative', width: 44, height: 44, borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                    <video 
                        src={fullUrl} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                style={{ width: 44, height: 44, borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} 
            />
        );
    };

    return (
        <div>
            <div style={{ padding: '16px', borderBottom: '1px solid #dbdbdb' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#262626' }}>Aktivitet</h3>
            </div>
            {activities.length === 0 ? (
                <div style={{ padding: '32px 24px', textAlign: 'center', color: '#8e8e8e', fontSize: '14px' }}>
                    Inga aktiviteter än
                </div>
            ) : (
                <div>
                    {activities.map((a, i) => (
                        <div 
                            key={i} 
                            onClick={() => handleClick(a)} 
                            style={{ 
                                padding: '12px 16px',
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px',
                                cursor: 'pointer',
                                borderBottom: i < activities.length - 1 ? '1px solid #efefef' : 'none',
                                transition: 'background-color 0.1s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            {a.actorProfileImageUrl && (
                                <img 
                                    src={buildMediaUrl(a.actorProfileImageUrl)} 
                                    alt="" 
                                    onClick={(e) => handleProfileClick(e, a.actorUsername)}
                                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} 
                                />
                            )}
                            <div style={{ flex: 1, fontSize: '14px', lineHeight: '18px', minWidth: 0 }}>
                                <div>
                                    <span 
                                        onClick={(e) => handleProfileClick(e, a.actorUsername)}
                                        style={{ fontWeight: 600, color: '#262626', cursor: 'pointer' }}
                                    >
                                        {a.actorUsername}
                                    </span>
                                    <span style={{ fontWeight: 400, color: '#262626' }}>
                                        {' '}{getText(a).substring(a.actorUsername.length)}
                                    </span>
                                </div>
                                <div style={{ color: '#8e8e8e', fontSize: '12px', marginTop: '2px' }}>
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
