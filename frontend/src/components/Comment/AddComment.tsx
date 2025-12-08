interface AddCommentProps {
    commentText: string;
    onCommentTextChange: (text: string) => void;
    onAddComment: () => void;
}

export default function AddComment({ commentText, onCommentTextChange, onAddComment }: AddCommentProps) {
    return (
        <div className="add-comment">
            <input
                type="text"
                value={commentText}
                onChange={(e) => onCommentTextChange(e.target.value)}
                placeholder="Skriv en kommentar..."
            />
            <button onClick={onAddComment}>
                <i className="bi bi-send-fill"></i>
            </button>
        </div>
    );
}
