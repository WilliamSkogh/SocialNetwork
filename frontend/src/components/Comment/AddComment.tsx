interface AddCommentProps {
    commentText: string;
    onCommentTextChange: (text: string) => void;
    onAddComment: () => void;
}

export default function AddComment({ commentText, onCommentTextChange, onAddComment }: AddCommentProps) {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && commentText.trim()) {
            onAddComment();
        }
    };

    return (
        <div className="add-comment">
            <input
                type="text"
                value={commentText}
                onChange={(e) => onCommentTextChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Lägg till en kommentar..."
            />
            <button onClick={onAddComment} disabled={!commentText.trim()}>
                Publicera
            </button>
        </div>
    );
}
