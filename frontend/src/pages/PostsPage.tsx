import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { apiClient } from "../services/axiosClient";

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
        <div className="container" style={{ maxWidth: "600px" }}>
            <h1>Inlägg</h1>

            <div className="mb-3">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-secondary'} me-2`}
                >
                    Alla inlägg
                </button>
                <button
                    onClick={() => setActiveTab('following')}
                    className={`btn ${activeTab === 'following' ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                    Följer
                </button>
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <h2>Skapa inlägg</h2>
                    <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Vad tänker du på?"
                        className="form-control mb-2"
                        rows={3}
                    />
                    <div className="mb-2">
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleImageChange}
                            className="form-control"
                        />
                        {selectedImage && (
                            <small className="text-muted">
                                Vald: {selectedImage.name}
                            </small>
                        )}
                    </div>
                    <button onClick={createPost} className="btn btn-primary">
                        Posta
                    </button>
                </div>
            </div>

            <div>
                {posts.map((post) => (
                    <div key={post.id} className="card mb-3">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center">
                                    <img 
                                        src={post.authorProfileImageUrl ? `https://localhost:7166${post.authorProfileImageUrl}` : "https://via.placeholder.com/32"}
                                        alt={post.authorUsername}
                                        className="rounded-circle me-2"
                                        style={{ width: "32px", height: "32px", objectFit: "cover" }}
                                    />
                                    <span 
                                        onClick={() => navigate(`/profile/${post.authorUsername}`)}
                                        className="fw-bold text-primary" style={{ cursor: "pointer" }}
                                    >
                                        {post.authorUsername}
                                    </span>
                                </div>
                                {user?.username === post.authorUsername && (
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Ta bort
                                    </button>
                                )}
                            </div>
                            {post.imageUrl && (
                                post.imageUrl.endsWith('.mp4') || post.imageUrl.endsWith('.webm') ? (
                                    <video controls className="w-100 mb-2" style={{ maxHeight: "400px" }}>
                                        <source src={`https://localhost:7166${post.imageUrl}`} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img 
                                        src={`https://localhost:7166${post.imageUrl}`} 
                                        alt="Post" 
                                        className="w-100 mb-2" 
                                        style={{ maxHeight: "400px", objectFit: "cover" }} 
                                    />
                                )
                            )}
                            <p>{post.content}</p>
                            <small className="text-muted">
                                {new Date(post.createdAt).toLocaleString()}
                            </small>
                            
                            <div className="my-2">
                                <button 
                                    onClick={() => handleLike(post.id, post.hasLiked)}
                                    className={`btn btn-sm me-2 ${post.hasLiked ? 'btn-primary' : 'btn-outline-primary'}`}
                                >
                                    <i className="bi bi-hand-thumbs-up-fill"></i> Gilla ({post.likesCount})
                                </button>
                                <button 
                                    onClick={() => handleDislike(post.id, post.hasDisliked)}
                                    className={`btn btn-sm ${post.hasDisliked ? 'btn-danger' : 'btn-outline-danger'}`}
                                >
                                    <i className="bi bi-hand-thumbs-down-fill"></i> Hata ({post.dislikesCount})
                                </button>
                            </div>

                            <div className="border-top pt-2">
                                <h6>Kommentarer ({post.comments?.length || 0})</h6>
                                
                                {post.comments?.map((comment) => (
                                    <div key={comment.id} className="bg-light p-2 mb-2 rounded">
                                        <div className="d-flex align-items-start">
                                            <img 
                                                src={comment.profileImageUrl ? `https://localhost:7166${comment.profileImageUrl}` : "https://via.placeholder.com/28"}
                                                alt={comment.username}
                                                className="rounded-circle me-2"
                                                style={{ width: "28px", height: "28px", objectFit: "cover" }}
                                            />
                                            <div className="flex-grow-1">
                                                <small className="text-muted">
                                                    <strong 
                                                        onClick={() => navigate(`/profile/${comment.username}`)}
                                                        className="text-primary" style={{ cursor: "pointer" }}
                                                    >
                                                        {comment.username}
                                                    </strong> - {new Date(comment.createdAt).toLocaleString()}
                                                </small>
                                                <div>{comment.text}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="mb-2">
                                    <button 
                                        onClick={() => {
                                            setCommentTexts({ ...commentTexts, [post.id]: "Cringe" });
                                        }}
                                        className="btn btn-sm btn-outline-secondary me-1"
                                    >
                                        Cringe
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setCommentTexts({ ...commentTexts, [post.id]: "L + ratio" });
                                        }}
                                        className="btn btn-sm btn-outline-secondary me-1"
                                    >
                                        L + ratio
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setCommentTexts({ ...commentTexts, [post.id]: "Bror vad sysslar du med?" });
                                        }}
                                        className="btn btn-sm btn-outline-secondary"
                                    >
                                        Bror vad sysslar du med?
                                    </button>
                                </div>
                                <div className="input-group mt-2">
                                    <input
                                        type="text"
                                        value={commentTexts[post.id] || ""}
                                        onChange={(e) => setCommentTexts({ ...commentTexts, [post.id]: e.target.value })}
                                        placeholder="Skriv en kommentar..."
                                        className="form-control"
                                    />
                                    <button 
                                        onClick={() => handleAddComment(post.id)}
                                        className="btn btn-outline-secondary"
                                    >
                                        Kommentera
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
