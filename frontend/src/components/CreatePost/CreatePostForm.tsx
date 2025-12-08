import { useEffect, useState } from "react";

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
        <div className="create-post">
            {title && <h5 className="fw-bold mb-3">{title}</h5>}
            <textarea
                className="form-control mb-2"
                placeholder={placeholder}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
            />

            {previewUrl && (
                <div style={{ position: "relative", marginBottom: "1rem" }}>
                    {isVideo ? (
                        <video
                            src={previewUrl}
                            controls
                            style={{
                                width: "100%",
                                maxHeight: "400px",
                                borderRadius: "8px",
                                objectFit: "contain",
                                background: "#000",
                            }}
                        />
                    ) : (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            style={{
                                width: "100%",
                                maxHeight: "400px",
                                borderRadius: "8px",
                                objectFit: "contain",
                            }}
                        />
                    )}
                    <button
                        onClick={removePreview}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "rgba(0, 0, 0, 0.7)",
                            border: "none",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "1.5rem",
                            padding: "5px 10px",
                            borderRadius: "50%",
                            width: "35px",
                            height: "35px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <i className="bi bi-x"></i>
                    </button>
                </div>
            )}

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
            <button onClick={createPost} className="btn btn-primary" disabled={isPosting}>
                <i className="bi bi-send-fill"></i> {submitLabel}
            </button>
        </div>
    );
}
