import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { apiClient } from "../services/axiosClient";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './PostsPage.css';

interface Comment {
    id: number;
    userId: string;
    username: string;
    profileImageUrl?: string;
    text: string;
    createdAt: string;
}

interface Post {
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
}

export default function PostsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'all' | 'following'>('all');
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [commentTexts, setCommentTexts] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        fetchPosts();
    }, [activeTab]);

    const fetchPosts = async () => {
        try {
            const endpoint = activeTab === 'following' ? '/api/posts/following' : '/api/posts';
            const response = await apiClient.get(endpoint);
            setPosts(response.data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        }
    };

    const createPost = async () => {
        if (!newPost.trim()) return;
        
        try {
            const formData = new FormData();
            formData.append("content", newPost);
            if (selectedImage) {
                formData.append("imageFile", selectedImage);
            }

            await apiClient.post("/api/posts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setNewPost("");
            setSelectedImage(null);
            await fetchPosts();
        } catch (error) {
            console.error("Failed to create post", error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleLike = async (postId: number, hasLiked: boolean) => {
        try {
            if (hasLiked) {
                await apiClient.delete(`/api/posts/${postId}/likes`);
            } else {
                await apiClient.post(`/api/posts/${postId}/likes`);
            }
            await fetchPosts();
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    const handleDislike = async (postId: number, hasDisliked: boolean) => {
        try {
            if (hasDisliked) {
                await apiClient.delete(`/api/posts/${postId}/dislikes`);
            } else {
                await apiClient.post(`/api/posts/${postId}/dislikes`);
            }
            await fetchPosts();
        } catch (error) {
            console.error("Failed to toggle dislike", error);
        }
    };

    const handleAddComment = async (postId: number) => {
        const text = commentTexts[postId];
        if (!text?.trim()) return;

        try {
            await apiClient.post(`/api/posts/${postId}/comments`, { text });
            setCommentTexts({ ...commentTexts, [postId]: "" });
            await fetchPosts();
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    const handleDelete = async (postId: number) => {
        if (!confirm("Är du säker på att du vill ta bort detta inlägg?")) return;

        try {
            await apiClient.delete(`/api/posts/${postId}`);
            await fetchPosts();
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };

    return (
        <div className="posts-page">
            <div className="posts-layout">
                <div className="sidebar-ad">
                    <div className="ad-card">
                        <div className="ad-badge">ANNONS</div>
                        <div className="ad-logo">
                            <img src="/src/assets/moverot-logo.png" alt="Moverot" />
                        </div>
                        <h3 className="ad-title">Moverot</h3>
                        <p className="ad-description">Använd ditt friskvårdsbidrag och använd det till träning som faktiskt blir av!</p>
                        <a href="https://moverot.se" className="ad-link">
                            Besök Moverot.se <i className="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </div>

                <div className="posts-container">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveTab('all')}
                            >
                                <i className="bi bi-globe"></i> Alla
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'following' ? 'active' : ''}`}
                                onClick={() => setActiveTab('following')}
                            >
                                <i className="bi bi-people-fill"></i> Följer
                            </button>
                        </li>
                    </ul>

            <div className="create-post">
                <h5 className="fw-bold mb-3">Skapa ett inlägg</h5>
                <textarea
                    className="form-control mb-2"
                    placeholder="Vad tänker du på?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows={3}
                />
                <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleImageChange}
                    className="form-control mb-2"
                />
                <button onClick={createPost} className="btn btn-primary">
                    <i className="bi bi-send-fill"></i> Publicera
                </button>
            </div>

            {posts.length === 0 ? (
                <div className="no-posts">
                    <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                    <p className="mt-3">Inga inlägg att visa</p>
                </div>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <div className="post-header">
                            <div className="post-author">
                                <img 
                                    src={post.authorProfileImageUrl ? `https://localhost:7166${post.authorProfileImageUrl}` : "https://via.placeholder.com/40"}
                                    alt={post.authorUsername}
                                />
                                <span onClick={() => navigate(`/profile/${post.authorUsername}`)}>
                                    {post.authorUsername}
                                </span>
                            </div>
                            {user?.username === post.authorUsername && (
                                <button onClick={() => handleDelete(post.id)} className="delete-btn">
                                    <i className="bi bi-trash"></i> Ta bort
                                </button>
                            )}
                        </div>

                        {post.imageUrl && (
                            post.imageUrl.endsWith('.mp4') || post.imageUrl.endsWith('.webm') ? (
                                <video controls className="post-image">
                                    <source src={`https://localhost:7166${post.imageUrl}`} type="video/mp4" />
                                </video>
                            ) : (
                                <img 
                                    src={`https://localhost:7166${post.imageUrl}`} 
                                    alt="Post"
                                    className="post-image"
                                />
                            )
                        )}

                        <div className="post-actions">
                            <button 
                                onClick={() => handleLike(post.id, post.hasLiked)}
                                className={`like-btn ${post.hasLiked ? 'active' : ''}`}
                            >
                                <i className="bi bi-hand-thumbs-up-fill"></i> Gilla
                            </button>
                            <button 
                                onClick={() => handleDislike(post.id, post.hasDisliked)}
                                className={`dislike-btn ${post.hasDisliked ? 'active' : ''}`}
                            >
                                <i className="bi bi-hand-thumbs-down-fill"></i> Hata
                            </button>
                            <button className="comment-btn">
                                <i className="bi bi-chat"></i> Kommentera
                            </button>
                        </div>

                        <div className="post-stats">
                            <span><i className="bi bi-heart-fill"></i> {post.likesCount} gillningar</span>
                            <span><i className="bi bi-heartbreak-fill"></i> {post.dislikesCount} hatningar</span>
                            <span><i className="bi bi-chat-fill"></i> {post.comments?.length || 0} kommentarer</span>
                        </div>

                        <div className="post-content">
                            <p><strong>{post.authorUsername}</strong> {post.content}</p>
                            <small className="text-muted">
                                {new Date(post.createdAt).toLocaleString()}
                            </small>
                        </div>

                        <div className="comments-section">
                            {post.comments?.map((comment) => (
                                <div key={comment.id} className="comment">
                                    <strong onClick={() => navigate(`/profile/${comment.username}`)}>
                                        {comment.username}
                                    </strong>
                                    {comment.text}
                                </div>
                            ))}

                                    <div className="quick-replies">
                                        <button 
                                            onClick={() => setCommentTexts({ ...commentTexts, [post.id]: "Cringe" })}
                                            className="quick-reply-btn"
                                        >
                                            Cringe
                                        </button>
                                        <button 
                                            onClick={() => setCommentTexts({ ...commentTexts, [post.id]: "L + ratio" })}
                                            className="quick-reply-btn"
                                        >
                                            L + ratio
                                        </button>
                                        <button 
                                            onClick={() => setCommentTexts({ ...commentTexts, [post.id]: "Bror vad sysslar du med?" })}
                                            className="quick-reply-btn"
                                        >
                                            Bror vad sysslar du med?
                                        </button>
                                    </div>

                                    <div className="add-comment">
                                        <input
                                            type="text"
                                            value={commentTexts[post.id] || ""}
                                            onChange={(e) => setCommentTexts({ ...commentTexts, [post.id]: e.target.value })}
                                            placeholder="Skriv en kommentar..."
                                        />
                                        <button onClick={() => handleAddComment(post.id)}>
                                            <i className="bi bi-send-fill"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="sidebar-ad">
                    <div className="ad-card flavorly">
                        <div className="ad-badge">ANNONS</div>
                        <div className="ad-logo">
                            <img src="/src/assets/flavorly-logo.png" alt="Flavorly" />
                        </div>
                        <h3 className="ad-title">Flavorly</h3>
                        <p className="ad-description">Share Cook Enjoy - Hitta dina favoritrecept idag</p>
                        <a href="https://flavorly.se" className="ad-link">
                            Besök Flavorly.se <i className="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
