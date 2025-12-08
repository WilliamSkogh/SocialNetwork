import { useState } from "react";

interface CreatePostFormProps {
    onPostCreated: () => void;
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
    const [newPost, setNewPost] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
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

            const { apiClient } = await import("../../services/axiosClient");
            await apiClient.post("/api/posts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setNewPost("");
            setSelectedImage(null);
            onPostCreated();
        } catch (error) {
            console.error("Failed to create post", error);
        }
    };

    return (
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
            {selectedImage && (
                <p className="text-success mb-2">
                    <i className="bi bi-check-circle-fill"></i> {selectedImage.name}
                </p>
            )}
            <button onClick={createPost} className="btn btn-primary">
                <i className="bi bi-send-fill"></i> Publicera
            </button>
        </div>
    );
}
