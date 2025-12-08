import { useState } from "react";

interface CreatePostFormProps {
    onPostCreated: () => void;
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
    const [newPost, setNewPost] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const removePreview = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedImage(null);
        setPreviewUrl(null);
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
            removePreview();
            onPostCreated();
        } catch (error) {
            console.error("Failed to create post", error);
        }
    };

    const isVideo = selectedImage?.type.startsWith('video/');

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
            
            {previewUrl && (
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    {isVideo ? (
                        <video
                            src={previewUrl}
                            controls
                            style={{
                                width: '100%',
                                maxHeight: '400px',
                                borderRadius: '8px',
                                objectFit: 'contain',
                                background: '#000'
                            }}
                        />
                    ) : (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            style={{
                                width: '100%',
                                maxHeight: '400px',
                                borderRadius: '8px',
                                objectFit: 'contain'
                            }}
                        />
                    )}
                    <button
                        onClick={removePreview}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(0, 0, 0, 0.7)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            padding: '5px 10px',
                            borderRadius: '50%',
                            width: '35px',
                            height: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
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
            <button onClick={createPost} className="btn btn-primary">
                <i className="bi bi-send-fill"></i> Publicera
            </button>
        </div>
    );
}
