import { useEffect, useState } from "react";
import { apiClient } from "../services/axiosClient";

interface Comment {
    id: number;
    userId: string;
    username: string;
    text: string;
    createdAt: string;
}

interface Post {
    id: number;
    authorId: string;
    authorUsername: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    likesCount: number;
    dislikesCount: number;
    comments: Comment[];
}

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [commentTexts, setCommentTexts] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await apiClient.get("/api/posts");
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

    const handleLike = async (postId: number) => {
        try {
            await apiClient.post(`/api/posts/${postId}/likes`);
            await fetchPosts();
        } catch (error) {
            console.error("Failed to like post", error);
        }
    };

    const handleDislike = async (postId: number) => {
        try {
            await apiClient.post(`/api/posts/${postId}/dislikes`);
            await fetchPosts();
        } catch (error) {
            console.error("Failed to dislike post", error);
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
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h1>Posts</h1>

            <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
                <h2>Create Post</h2>
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="What's on your mind?"
                    style={{ width: "100%", minHeight: "80px", padding: "10px", marginBottom: "10px" }}
                />
                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleImageChange}
                    />
                    {selectedImage && (
                        <div style={{ marginTop: "8px", fontSize: "14px", color: "#666" }}>
                            Selected: {selectedImage.name}
                        </div>
                    )}
                </div>
                <button onClick={createPost} style={{ padding: "10px 20px" }}>
                    Post
                </button>
            </div>

            <div>
                {posts.map((post) => (
                    <div key={post.id} style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <div style={{ fontWeight: "bold", color: "#333" }}>
                                {post.authorUsername}
                            </div>
                            <button
                                onClick={() => handleDelete(post.id)}
                                style={{ 
                                    padding: "4px 12px", 
                                    backgroundColor: "#dc3545", 
                                    color: "white", 
                                    border: "none", 
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "12px"
                                }}
                            >
                                Ta bort
                            </button>
                        </div>
                        {post.imageUrl && (
                            post.imageUrl.endsWith('.mp4') || post.imageUrl.endsWith('.webm') ? (
                                <video controls style={{ width: "100%", maxHeight: "400px", marginBottom: "10px" }}>
                                    <source src={`https://localhost:7166${post.imageUrl}`} type="video/mp4" />
                                </video>
                            ) : (
                                <img 
                                    src={`https://localhost:7166${post.imageUrl}`} 
                                    alt="Post" 
                                    style={{ width: "100%", maxHeight: "400px", objectFit: "cover", marginBottom: "10px" }} 
                                />
                            )
                        )}
                        <p style={{ marginBottom: "10px" }}>{post.content}</p>
                        <small style={{ color: "#666", display: "block", marginBottom: "10px" }}>
                            {new Date(post.createdAt).toLocaleString()}
                        </small>
                        
                        <div style={{ marginBottom: "15px" }}>
                            <button 
                                onClick={() => handleLike(post.id)}
                                style={{ marginRight: "10px", padding: "5px 15px", cursor: "pointer" }}
                            >
                                👍 Like ({post.likesCount})
                            </button>
                            <button 
                                onClick={() => handleDislike(post.id)}
                                style={{ padding: "5px 15px", cursor: "pointer" }}
                            >
                                👎 Dislike ({post.dislikesCount})
                            </button>
                        </div>

                        <div style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
                            <h4 style={{ fontSize: "16px", marginBottom: "10px" }}>
                                Comments ({post.comments?.length || 0})
                            </h4>
                            
                            {post.comments?.map((comment) => (
                                <div key={comment.id} style={{ 
                                    padding: "8px", 
                                    backgroundColor: "#f9f9f9", 
                                    marginBottom: "8px", 
                                    borderRadius: "4px" 
                                }}>
                                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                                        <strong>{comment.username}</strong> - {new Date(comment.createdAt).toLocaleString()}
                                    </div>
                                    <div>{comment.text}</div>
                                </div>
                            ))}

                            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                                <input
                                    type="text"
                                    value={commentTexts[post.id] || ""}
                                    onChange={(e) => setCommentTexts({ ...commentTexts, [post.id]: e.target.value })}
                                    placeholder="Add a comment..."
                                    style={{ flex: 1, padding: "8px" }}
                                />
                                <button 
                                    onClick={() => handleAddComment(post.id)}
                                    style={{ padding: "8px 15px" }}
                                >
                                    Comment
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
