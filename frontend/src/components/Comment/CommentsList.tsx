import { useState } from "react";
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
    const [showAll, setShowAll] = useState(false);
    const displayedComments = showAll ? comments : comments?.slice(0, 1) || [];
    const hasMore = comments && comments.length > 1;

    const handleQuickReply = (emoji: string) => {
        onCommentTextChange(commentText + emoji);
    };

    return (
        <div className="comments-section">
            {displayedComments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
            ))}

            {hasMore && !showAll && (
                <button 
                    onClick={() => setShowAll(true)}
                    className="view-more-comments"
                >
                    Visa alla {comments.length} kommentarer
                </button>
            )}

            {hasMore && showAll && (
                <button 
                    onClick={() => setShowAll(false)}
                    className="view-more-comments"
                >
                    Dölj kommentarer
                </button>
            )}

            <QuickReplies onQuickReply={handleQuickReply} />

            <AddComment
                commentText={commentText}
                onCommentTextChange={onCommentTextChange}
                onAddComment={onAddComment}
            />
        </div>
    );
}
