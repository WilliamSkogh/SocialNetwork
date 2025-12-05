import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useEffect, useState, type ChangeEvent } from "react";
import { profiileService } from "../services/ProfileService";
import type { UserProfile } from "../types/types";
import { Container, Image, Button, Form } from "react-bootstrap";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import config from "../config";
import '../styles/profilepage.css'

const API_BASE_URL = config.apiBaseUrl;

export default function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editBio, setEditBio] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showPicker, setShowPicker] = useState(false);

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
                                    <Button variant="primary" size="sm" className="action-btn flex-grow-1">
                                        Följ
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

            <div className="border-top pt-4">
                <div className="text-center text-muted">
                    <i className="bi bi-grid-3x3 fs-3"></i>
                    <p className="mt-2">Inga inlägg ännu</p>
                </div>
            </div>
        </Container>
    );
}