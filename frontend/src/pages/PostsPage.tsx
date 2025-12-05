import { useEffect, useState } from "react";
import { apiClient } from "../services/axiosClient";

interface Post {
    id: number;
    authorId: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
}

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

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
                        <p>{post.content}</p>
                        <small style={{ color: "#666" }}>{new Date(post.createdAt).toLocaleString()}</small>
                    </div>
                ))}
            </div>
        </div>
    );
}
