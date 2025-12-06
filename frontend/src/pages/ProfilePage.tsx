import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useEffect, useState, type ChangeEvent } from "react";
import { profiileService } from "../services/ProfileService";
import type { UserProfile } from "../types/types";
import { Container, Image, Button, Form } from "react-bootstrap";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import config from "../config";
import '../styles/profilepage.css'
import { apiClient } from "../services/axiosClient";

const API_BASE_URL = config.apiBaseUrl;

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

export default function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editBio, setEditBio] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [commentTexts, setCommentTexts] = useState<{ [key: number]: string }>({});

    const isMyProfile = currentUser && profile && currentUser.username?.toLowerCase() === profile.userName?.toLowerCase();

    useEffect(() => {
        if (!username) return;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await profiileService.getProfile(username);
                setProfile(data);
                setEditBio(data.bio || "");
                
                
                const postsResponse = await apiClient.get(`/api/users/${data.userId}/posts`);
                setPosts(postsResponse.data);
            } catch (err) {
                console.error(err);
                setError("kunde inte hämta profilen");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    const handleUpdateProfile = async () => {
        if (!profile) return;
        try {
            await profiileService.updateProfile(profile.userName, editBio, selectedFile);
            const updatedData = await profiileService.getProfile(profile.userName);
            setProfile(updatedData);
            setIsEditing(false);
            setSelectedFile(null);
            setShowPicker(false);
        } catch (err) {
            console.error(err);
            alert("Något gick fel när profilen skulle sparas");
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setEditBio((prev) => prev + emojiData.emoji);
    };

    const handleCreateWallPost = async () => {
        if (!newPost.trim() || !profile) return;
        
        try {
            const formData = new FormData();
            formData.append("content", newPost);
            if (selectedImage) {
                formData.append("imageFile", selectedImage);
            }

            await apiClient.post(`/api/users/${profile.userId}/posts`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setNewPost("");
            setSelectedImage(null);
            
            
            const postsResponse = await apiClient.get(`/api/users/${profile.userId}/posts`);
            setPosts(postsResponse.data);
        } catch (error) {
            console.error("Failed to create wall post", error);
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
            const postsResponse = await apiClient.get(`/api/users/${profile?.userId}/posts`);
            setPosts(postsResponse.data);
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
            const postsResponse = await apiClient.get(`/api/users/${profile?.userId}/posts`);
            setPosts(postsResponse.data);
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
            const postsResponse = await apiClient.get(`/api/users/${profile?.userId}/posts`);
            setPosts(postsResponse.data);
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    const handleDelete = async (postId: number) => {
        if (!confirm("Är du säker på att du vill ta bort detta inlägg?")) return;

        try {
            await apiClient.delete(`/api/posts/${postId}`);
            const postsResponse = await apiClient.get(`/api/users/${profile?.userId}/posts`);
            setPosts(postsResponse.data);
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };


    if (loading) return <div className="text-center mt-5">Laddar profil...</div>;
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
    if (!profile) return <div className="text-center mt-5">Ingen profil hittades.</div>;

    const imageUrl = profile.profileImageUrl ? `${API_BASE_URL}${profile.profileImageUrl}`
        : "https://via.placeholder.com/150";

    return (
        <Container className="mt-4 profile-container">
            <header className="mb-5">
                {isEditing ? (
                    <div className="p-3 bg-light rounded shadow-sm">
                        <div className="text-center mb-4">
                            <Image
                                src={imageUrl}
                                alt={profile.userName}
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                roundedCircle
                            />
                        </div>
                        <h5 className="mb-3">Redigera profil</h5>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-muted">Byt profilbild</Form.Label>
                                <Form.Control size="sm" type="file" onChange={handleFileChange} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <Form.Label className="small fw-bold text-muted mb-0">Bio</Form.Label>
                                    <Button
                                        variant="light"
                                        size="sm"
                                        className="p-0 border-0 text-muted"
                                        onClick={() => setShowPicker(!showPicker)}
                                        title="Infoga emoji"
                                    >
                                        <i className="bi bi-emoji-smile fs-5"></i>
                                    </Button>
                                </div>
                                <Form.Control as="textarea" rows={3} value={editBio} onChange={e => setEditBio(e.target.value)} maxLength={500} />
                                {showPicker && (
                                    <div className="mt-2">
                                        <EmojiPicker
                                            onEmojiClick={onEmojiClick}
                                            autoFocusSearch={false}
                                            width="100%"
                                            height={350}
                                            previewConfig={{ showPreview: false }}
                                        />
                                    </div>
                                )}
                                <div className="text-end small text-muted mt-1">{editBio.length}/500</div>
                            </Form.Group>

                            <div className="d-flex gap-2">
                                <Button size="sm" variant="primary" onClick={handleUpdateProfile}>Spara</Button>
                                <Button size="sm" variant="outline-secondary" onClick={() => { setIsEditing(false); setShowPicker(false); }}>Avbryt</Button>
                            </div>
                        </Form>
                    </div>
                ) : (
                    <div className="profile-header-grid">
                        <div className="ph-img">
                            <Image
                                src={imageUrl}
                                alt={profile.userName}
                                className="profileimage"
                            />
                        </div>

                        <div className="ph-name">
                            <h2 className="username-title">{profile.userName}</h2>
                        </div>

                        <div className="ph-stats">
                            <ul className="stats-list">
                                <li><span className="stats-value">0</span><span className="stats-label">inlägg</span></li>
                                <li><span className="stats-value">{profile.followerCount}</span><span className="stats-label">följare</span></li>
                                <li><span className="stats-value">{profile.followingCount}</span><span className="stats-label">följer</span></li>
                            </ul>
                        </div>

                        <div className="ph-actions d-flex gap-2">
                            {isMyProfile ? (
                                <Button variant="outline-secondary" size="sm" className="action-btn" onClick={() => setIsEditing(true)}>
                                    Redigera profil
                                </Button>
                            ) : (
                                <>
                                    <Button 
                                        variant={profile.isFollowing ? "outline-primary" : "primary"} 
                                        size="sm" 
                                        className="action-btn flex-grow-1"
                                        onClick={async () => {
                                            try {
                                                if (profile.isFollowing) {
                                                    await profiileService.unfollowUser(profile.userId);
                                                } else {
                                                    await profiileService.followUser(profile.userId);
                                                }
                                                const updatedProfile = await profiileService.getProfile(username!);
                                                setProfile(updatedProfile);
                                            } catch (err) {
                                                console.error(err);
                                                alert("Kunde inte uppdatera följ-status");
                                            }
                                        }}
                                    >
                                        {profile.isFollowing ? "Följer" : "Följ"}
                                    </Button>
                                    <Button variant="outline-secondary" size="sm" className="action-btn flex-grow-1" onClick={() => alert("Kommer snart!")}>
                                        Meddelande
                                    </Button>
                                </>
                            )}
                        </div>

                        <div className="ph-bio">
                            <div className="bio-text">{profile.bio}</div>
                        </div>
                    </div>
                )}
            </header>

            {!isMyProfile && (
                <div className="card mb-3">
                    <div className="card-body">
                        <h5>Skriv på {profile.userName}s vägg</h5>
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="Skriv något..."
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
                        <Button onClick={handleCreateWallPost}>Posta</Button>
                    </div>
                </div>
            )}

            <div className="border-top pt-4">
                {posts.length === 0 ? (
                    <div className="text-center text-muted">
                        <i className="bi bi-grid-3x3 fs-3"></i>
                        <p className="mt-2">Inga inlägg ännu</p>
                    </div>
                ) : (
                    <div>
                        {posts.map((post) => (
                            <div key={post.id} className="card mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center">
                                            <img 
                                                src={post.authorProfileImageUrl ? `${API_BASE_URL}${post.authorProfileImageUrl}` : "https://via.placeholder.com/32"}
                                                alt={post.authorUsername}
                                                className="rounded-circle me-2"
                                                style={{ width: "32px", height: "32px", objectFit: "cover" }}
                                            />
                                            <div>
                                                <span 
                                                    onClick={() => navigate(`/profile/${post.authorUsername}`)}
                                                    className="fw-bold text-primary" style={{ cursor: "pointer" }}
                                                >
                                                    {post.authorUsername}
                                                </span>
                                                {post.recipientUsername && (
                                                    <>
                                                        <span className="text-muted mx-1">→</span>
                                                        <span 
                                                            onClick={() => navigate(`/profile/${post.recipientUsername}`)}
                                                            className="fw-bold text-primary" style={{ cursor: "pointer" }}
                                                        >
                                                            {post.recipientUsername}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {currentUser?.username === post.authorUsername && (
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
                                                <source src={`${API_BASE_URL}${post.imageUrl}`} type="video/mp4" />
                                            </video>
                                        ) : (
                                            <img 
                                                src={`${API_BASE_URL}${post.imageUrl}`} 
                                                alt="Inlägg" 
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
                                                        src={comment.profileImageUrl ? `${API_BASE_URL}${comment.profileImageUrl}` : "https://via.placeholder.com/28"}
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
                                                placeholder="Kommentera..."
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
                )}
            </div>
        </Container>
    );
}