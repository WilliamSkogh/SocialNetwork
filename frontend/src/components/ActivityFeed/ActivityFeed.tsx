import { useEffect, useState } from 'react';
import { apiClient } from '../../services/axiosClient';
import './ActivityFeed.css';

interface Activity {
    type: 'like';
    actorUsername: string;
    createdAt: string;
}

export default function ActivityFeed() {
    const [activities, setActivities] = useState<Activity[]>([]);

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

    return (
        <div className="activity-feed">
            <h3>Aktivitet</h3>
            {activities.length === 0 ? (
                <p>Inga aktiviteter</p>
            ) : (
                <div>
                    {activities.map((a, i) => (
                        <div key={i}>
                            <span>{a.actorUsername} gillade ditt inlägg</span>
                            <span> - {getTime(a.createdAt)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
