import { useState } from "react";
import { useAuth } from "../../AuthContext";
import { apiClient } from "../../services/axiosClient";
import PostHeader from "./PostHeader.tsx";
import PostImage from "./PostImage.tsx";
import PostContent from "./PostContent.tsx";
import PostActions from "./PostActions.tsx";
import PostStats from "./PostStats.tsx";
import CommentsList from "../Comment/CommentsList.tsx";

interface Comment {
    id: number;
    userId: string;
    username: string;
    profileImageUrl?: string;
    text: string;
    createdAt: string;
}

interface PostCardProps {
    post: {
        id: number;
        authorId: string;
        authorUsername: string;
        authorProfileImageUrl?: string;
        recipientId?: string;
        recipientUsername?: string;
        recipientProfileImageUrl?: string;
        content: string;
        imageUrl?: string;
        createdAt: string;
        likesCount: number;
        dislikesCount: number;
        hasLiked: boolean;
        hasDisliked: boolean;
        comments: Comment[];
    };
    onUpdate: () => void;
}

export default function PostCard({ post, onUpdate }: PostCardProps) {
    const { user } = useAuth();
    const [commentText, setCommentText] = useState("");
    const [showHeartAnimation, setShowHeartAnimation] = useState(false);
    const [lastTap, setLastTap] = useState(0);

    const handleLike = async () => {
        try {
            if (post.hasLiked) {
                await apiClient.delete(`/api/posts/${post.id}/likes`);
            } else {
                if (post.hasDisliked) {
                    await apiClient.delete(`/api/posts/${post.id}/dislikes`);
                }
                await apiClient.post(`/api/posts/${post.id}/likes`);
            }
            onUpdate();
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    const handleDislike = async () => {
        try {
            if (post.hasDisliked) {
                await apiClient.delete(`/api/posts/${post.id}/dislikes`);
            } else {
                if (post.hasLiked) {
                    await apiClient.delete(`/api/posts/${post.id}/likes`);
                }
                await apiClient.post(`/api/posts/${post.id}/dislikes`);
            }
            onUpdate();
        } catch (error) {
            console.error("Failed to toggle dislike", error);
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            await apiClient.post(`/api/posts/${post.id}/comments`, { text: commentText });
            setCommentText("");
            onUpdate();
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Är du säker på att du vill ta bort detta inlägg?")) return;

        try {
            await apiClient.delete(`/api/posts/${post.id}`);
            onUpdate();
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };

    const handleDoubleTap = (e: React.MouseEvent) => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (now - lastTap < DOUBLE_TAP_DELAY && now - lastTap > 0) {
            e.preventDefault();
            if (!post.hasLiked) {
                handleLike();
            }
            setShowHeartAnimation(true);
            setTimeout(() => setShowHeartAnimation(false), 1000);
            setLastTap(0);
        } else {
            setLastTap(now);
        }
    };

    return (
        <div className="post-card" style={{ position: 'relative' }}>
            <PostHeader
                authorUsername={post.authorUsername}
                authorProfileImageUrl={post.authorProfileImageUrl}
                recipientUsername={post.recipientUsername}
                canDelete={user?.username === post.authorUsername}
                onDelete={handleDelete}
            />

            {!post.imageUrl && (
                <PostContent
                    authorUsername={post.authorUsername}
                    content={post.content}
                    createdAt={post.createdAt}
                />
            )}

            {post.imageUrl && (
                <div 
                    style={{ position: 'relative', userSelect: 'none' }}
                    onClick={handleDoubleTap}
                >
                    <PostImage imageUrl={post.imageUrl} />
                    
                    {showHeartAnimation && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                pointerEvents: 'none',
                                animation: 'heartPop 1s ease-out',
                                zIndex: 10
                            }}
                        >
                            <i 
                                className="bi bi-heart-fill" 
                                style={{ 
                                    fontSize: '6rem', 
                                    color: '#e74c3c',
                                    filter: 'drop-shadow(0 0 10px rgba(231, 76, 60, 0.5))'
                                }}
                            ></i>
                        </div>
                    )}
                </div>
            )}

            {post.imageUrl && (
                <PostContent
                    authorUsername={post.authorUsername}
                    content={post.content}
                    createdAt={post.createdAt}
                />
            )}

            <PostActions
                hasLiked={post.hasLiked}
                hasDisliked={post.hasDisliked}
                onLike={handleLike}
                onDislike={handleDislike}
            />

            <PostStats
                likesCount={post.likesCount}
                dislikesCount={post.dislikesCount}
                commentsCount={post.comments?.length || 0}
            />

            <CommentsList
                comments={post.comments}
                commentText={commentText}
                onCommentTextChange={setCommentText}
                onAddComment={handleAddComment}
            />
        </div>
    );
}
