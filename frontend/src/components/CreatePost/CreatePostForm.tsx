import { useEffect, useRef, useState } from "react";
import "../../styles/CreatePostForm.css";

interface CreatePostFormProps {
    onPostCreated: () => void;
    recipientUserId?: string;
    title?: string;
    placeholder?: string;
    submitLabel?: string;
}

export default function CreatePostForm({
    onPostCreated,
    recipientUserId,
    title = "Skapa ett inlägg",
    placeholder = "Vad tänker du på?",
    submitLabel = "Publicera"
}: CreatePostFormProps) {
    const [newPost, setNewPost] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!selectedImage) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(selectedImage);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [selectedImage]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
        }
    };

    const removePreview = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
    };

    const createPost = async () => {
        if (!newPost.trim()) return;

        try {
            setIsPosting(true);
            const formData = new FormData();
            formData.append("content", newPost);
            if (selectedImage) {
                formData.append("imageFile", selectedImage);
            }

            const { apiClient } = await import("../../services/axiosClient");
            const endpoint = recipientUserId ? `/api/users/${recipientUserId}/posts` : "/api/posts";
            await apiClient.post(endpoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setNewPost("");
            removePreview();
            onPostCreated();
        } catch (error) {
            console.error("Failed to create post", error);
        } finally {
            setIsPosting(false);
        }
    };

    const isVideo = selectedImage?.type.startsWith("video/");

    return (
        <div className="create-post-form">
            {title && <h5>{title}</h5>}
            
            <textarea
                className="create-post-textarea"
                placeholder={placeholder}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
            />

            {previewUrl && (
                <div className="preview-container">
                    {isVideo ? (
                        <video
                            src={previewUrl}
                            controls
                            className="preview-media"
                        />
                    ) : (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="preview-media"
                        />
                    )}
                    <button
                        onClick={removePreview}
                        className="preview-remove-btn"
                    >
                        <i className="bi bi-x"></i>
                    </button>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleImageChange}
                className="file-input-hidden"
            />

            <div className="create-post-actions">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="file-select-btn"
                >
                    <i className="bi bi-image"></i>
                    {selectedImage ? selectedImage.name : 'Bild/Video'}
                </button>
                
                <button 
                    onClick={createPost}
                    disabled={isPosting || !newPost.trim()}
                    className="submit-btn"
                >
                    <i className="bi bi-send-fill"></i> {submitLabel}
                </button>
            </div>
        </div>
    );
}
