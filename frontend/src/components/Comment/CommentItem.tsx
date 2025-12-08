import { useNavigate } from "react-router-dom";
import { buildMediaUrl } from "../../utils/media";

interface Comment {
    id: number;
    userId: string;
    username: string;
    profileImageUrl?: string;
    text: string;
    createdAt: string;
}

interface CommentItemProps {
    comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
    const navigate = useNavigate();

    const getRelativeTime = (dateString: string) => {
        const now = new Date();
        const commentDate = new Date(dateString);
        const diffMs = now.getTime() - commentDate.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);

        if (diffSecs < 60) return 'just nu';
        if (diffMins < 60) return `${diffMins}min sedan`;
        if (diffHours < 24) return `${diffHours}h sedan`;
        if (diffDays < 7) return `${diffDays}d sedan`;
        if (diffWeeks < 4) return `${diffWeeks}v sedan`;
        return commentDate.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="comment">
            <img 
                src={buildMediaUrl(comment.profileImageUrl) ?? "https://via.placeholder.com/32"}
                alt={comment.username}
                className="comment-avatar"
            />
            <div className="comment-content">
                <strong onClick={() => navigate(`/profile/${comment.username}`)}>
                    {comment.username}
                </strong>
                <span>{comment.text}</span>
                <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    {getRelativeTime(comment.createdAt)}
                </small>
            </div>
        </div>
    );
}
