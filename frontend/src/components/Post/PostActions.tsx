interface PostActionsProps {
    hasLiked: boolean;
    hasDisliked: boolean;
    onLike: () => void;
    onDislike: () => void;
}

export default function PostActions({ hasLiked, hasDisliked, onLike, onDislike }: PostActionsProps) {
    return (
        <div className="post-actions">
            <button 
                onClick={onLike}
                className={`like-btn ${hasLiked ? 'active' : ''}`}
            >
                <i className="bi bi-hand-thumbs-up-fill"></i> 
            </button>
            <button 
                onClick={onDislike}
                className={`dislike-btn ${hasDisliked ? 'active' : ''}`}
            >
                <i className="bi bi-hand-thumbs-down-fill"></i> 
            </button>
        </div>
    );
}
