interface PostActionsProps {
    hasLiked: boolean;
    hasDisliked: boolean;
    onLike: () => void;
    onDislike: () => void;
}

export default function PostActions({ hasLiked, hasDisliked, onLike, onDislike }: PostActionsProps) {
    return (
        <div className="post-actions" style={{ padding: '0.5rem 1rem' }}>
            <button 
                onClick={onLike}
                className={`like-btn ${hasLiked ? 'active' : ''}`}
                style={{ 
                    padding: '0.5rem',
                    fontSize: '0.85rem'
                }}
            >
                <i className="bi bi-hand-thumbs-up-fill"></i> 
            </button>
            <button 
                onClick={onDislike}
                className={`dislike-btn ${hasDisliked ? 'active' : ''}`}
                style={{ 
                    padding: '0.5rem',
                    fontSize: '0.85rem'
                }}
            >
                <i className="bi bi-hand-thumbs-down-fill"></i> 
            </button>
        </div>
    );
}
