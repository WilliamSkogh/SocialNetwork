import { useNavigate } from "react-router-dom";

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

    return (
        <div className="comment">
            <img 
                src={comment.profileImageUrl ? `https://localhost:7166${comment.profileImageUrl}` : "https://via.placeholder.com/32"}
                alt={comment.username}
                className="comment-avatar"
            />
            <div className="comment-content">
                <strong onClick={() => navigate(`/profile/${comment.username}`)}>
                    {comment.username}
                </strong>
                <span>{comment.text}</span>
            </div>
        </div>
    );
}
