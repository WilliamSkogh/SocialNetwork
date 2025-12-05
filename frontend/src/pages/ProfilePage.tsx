import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useEffect, useState, type ChangeEvent } from "react";
import { profiileService } from "../services/ProfileService";
import type { UserProfile } from "../types/types";
import { Container, Row, Col, Image, Button, Form } from "react-bootstrap";
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

    if (loading) return <div className="text-center mt-5">Laddar profil...</div>;
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
    if (!profile) return <div className="text-center mt-5">Ingen profil hittades.</div>;

    const imageUrl = profile.profileImageUrl ? `${API_BASE_URL}${profile.profileImageUrl}`
        : "https://via.placeholder.com/150";

    return (
        <Container className="mt-4 profile-container">

            <header className="mb-5">
                <Row className="align-items-start align-items-md-center">
                    <Col xs={4} md={4} className="d-flex justify-content-center justify-content-md-center mb-3 mb-md-0">
                        <div className="profile-image-container">
                            <Image
                                src={imageUrl}
                                alt={profile.userName}
                                className="profileimage"
                                roundedCircle
                            />
                        </div>
                    </Col>
                    <Col xs={8} md={8}>
                        {isEditing ? (
                            <div className="p-3 bg-light rounded">
                                <h5 className="mb-3">Redigera profil</h5>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold text-muted">Byt profilbild</Form.Label>
                                        <Form.Control size="sm" type="file" onChange={handleFileChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold text-muted">Bio</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={editBio}
                                            onChange={e => setEditBio(e.target.value)}
                                        />
                                    </Form.Group>
                                    <div className="d-flex gap-2">
                                        <Button size="sm" variant="primary" onClick={handleUpdateProfile}>Spara</Button>
                                        <Button size="sm" variant="outline-secondary" onClick={() => setIsEditing(false)}>Avbryt</Button>
                                    </div>
                                </Form>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-2 gap-md-3">
                                <h2 className="username-title m-0 order-1">{profile.userName}</h2>
                                <ul className="stats-list order-2 order-md-2">
                                    <li>
                                        <span className="stats-value">0</span>
                                        <span className="stats-label">inlägg</span>
                                    </li>
                                    <li>
                                        <span className="stats-value">{profile.followerCount}</span>
                                        <span className="stats-label">följare</span>
                                    </li>
                                    <li>
                                        <span className="stats-value">{profile.followingCount}</span>
                                        <span className="stats-label">följer</span>
                                    </li>
                                </ul>
                                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center order-3 order-md-3">
                                    {isMyProfile ? (
                                        <Button variant="outline-secondary" size="sm" className="action-btn px-3 w-md-auto" onClick={() => setIsEditing(true)}>
                                            Redigera profil
                                        </Button>
                                    ) : (
                                        <div className="d-flex gap-2 w-100 w-md-auto">
                                            <Button variant="primary" size="sm" className="action-btn px-4 flex-grow-1 flex-md-grow-0">
                                                Följ
                                            </Button>
                                            <Button variant="outline-secondary" size="sm" className="action-btn px-3 flex-grow-1 flex-md-grow-0" onClick={() => alert("Kommer snart!")}>
                                                Meddelande
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div className="d-none d-md-block order-4">
                                    <div className="bio-text">{profile.bio}</div>
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>
                {!isEditing && (
                    <div className="d-md-none mt-2 px-2">
                        <div className="bio-text">{profile.bio}</div>
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