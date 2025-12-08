import CommentItem from "./CommentItem";
import QuickReplies from "./QuickReplies";
import AddComment from "./AddComment";

interface Comment {
    id: number;
    userId: string;
    username: string;
    profileImageUrl?: string;
    text: string;
    createdAt: string;
}

interface CommentsListProps {
    comments: Comment[];
    commentText: string;
    onCommentTextChange: (text: string) => void;
    onAddComment: () => void;
}

export default function CommentsList({ 
    comments, 
    commentText, 
    onCommentTextChange, 
    onAddComment 
}: CommentsListProps) {
    return (
        <div className="comments-section">
            {comments?.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
            ))}

            <QuickReplies onQuickReply={onCommentTextChange} />

            <AddComment
                commentText={commentText}
                onCommentTextChange={onCommentTextChange}
                onAddComment={onAddComment}
            />
        </div>
    );
}
