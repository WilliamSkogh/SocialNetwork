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
                <i className={`bi ${hasLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`}></i>
            </button>
            <button 
                onClick={onDislike}
                className={`dislike-btn ${hasDisliked ? 'active' : ''}`}
            >
                <i className={`bi ${hasDisliked ? 'bi-hand-thumbs-down-fill' : 'bi-hand-thumbs-down'}`}></i>
            </button>
        </div>
    );
}
