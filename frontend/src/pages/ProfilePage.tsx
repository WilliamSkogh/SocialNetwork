import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useEffect, useState, type ChangeEvent } from "react";
import { profiileService } from "../services/ProfileService";
import type { UserProfile } from "../types/types";
import { Container, Button, Form } from "react-bootstrap";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { buildMediaUrl } from "../utils/media";
import '../styles/profilepage.css'
import '../pages/PostsPage.css'
import { apiClient } from "../services/axiosClient";
import PostCard from "../components/Post/PostCard";
import CreatePostForm from "../components/CreatePost/CreatePostForm";

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
    const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);

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
                setError("kunde inte hÃ¤mta profilen");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    useEffect(() => {
        if (!selectedFile) {
            setProfilePreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(selectedFile);
        setProfilePreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [selectedFile]);

    const fetchPosts = async () => {
        if (!profile) return;
        try {
            const postsResponse = await apiClient.get(`/api/users/${profile.userId}/posts`);
            setPosts(postsResponse.data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        }
    };

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
            alert("NÃ¥got gick fel nÃ¤r profilen skulle sparas");
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

    if (loading) return <div className="text-center mt-5">Laddar profil...</div>;
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
    if (!profile) return <div className="text-center mt-5">Ingen profil hittades.</div>;

    const imageUrl = profilePreviewUrl ?? buildMediaUrl(profile.profileImageUrl) ?? `https://ui-avatars.com/api/?name=${profile.userName.charAt(0)}&background=6c757d&color=fff&size=150`;

    return (
        <Container className="mt-4 profile-container">
            <header className="mb-5">
                {isEditing ? (
                    <div className="p-3 rounded shadow-sm" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                        <div className="text-center mb-4">
                            <img
                                src={imageUrl}
                                alt={profile.userName}
                                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        </div>
                        <h5 className="mb-3" style={{ color: 'var(--text-primary)' }}>Redigera profil</h5>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold" style={{ color: 'var(--text-secondary)' }}>Byt profilbild</Form.Label>
                                <Form.Control size="sm" type="file" onChange={handleFileChange} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <Form.Label className="small fw-bold mb-0" style={{ color: 'var(--text-secondary)' }}>Bio</Form.Label>
                                    <Button
                                        variant="light"
                                        size="sm"
                                        className="p-0 border-0"
                                        style={{ color: 'var(--text-secondary)' }}
                                        onClick={() => setShowPicker(!showPicker)}
                                        title="Infoga emoji"
                                    >
                                        <i className="bi bi-emoji-smile fs-5"></i>
                                    </Button>
                                </div>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={editBio}
                                    onChange={e => setEditBio(e.target.value)}
                                    maxLength={500}
                                    style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                                />
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
                                <div className="text-end small mt-1" style={{ color: 'var(--text-secondary)' }}>{editBio.length}/500</div>
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
                            <img
                                src={imageUrl}
                                alt={profile.userName}
                                className="profileimage"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>

                        <div className="ph-name">
                            <h2 className="username-title">{profile.userName}</h2>
                        </div>

                        <div className="ph-stats">
                            <ul className="stats-list">
                                <li><span className="stats-value">0</span><span className="stats-label">Inlägg</span></li>
                                <li><span className="stats-value">{profile.followerCount}</span><span className="stats-label">Följare</span></li>
                                <li><span className="stats-value">{profile.followingCount}</span><span className="stats-label">Följer</span></li>
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
                                    <Button variant="outline-secondary" size="sm" className="action-btn flex-grow-1" onClick={() => navigate(`/messages/${profile.userId}`)}>
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
                <div className="mb-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
                    <CreatePostForm
                        onPostCreated={fetchPosts}
                        recipientUserId={profile.userId}
                        title={`Skriv på ${profile.userName}s vägg`}
                        placeholder="Skriv något..."
                        submitLabel="Posta"
                    />
                </div>
            )}

            <div className="border-top pt-4">
                {posts.length === 0 ? (
                    <div className="text-center" style={{ color: 'var(--text-secondary)' }}>
                        <i className="bi bi-grid-3x3 fs-3"></i>
                        <p className="mt-2">Inga inlÃ¤gg Ã¤nnu</p>
                    </div>
                ) : (
                    <div>
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
                        ))}
                    </div>
                )}
            </div>
        </Container>
    );
}

