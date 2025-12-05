import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useEffect, useState, type ChangeEvent } from "react";
import { profiileService } from "../services/ProfileService";
import type { UserProfile } from "../types/types";
import { Container, Card, Row, Col, Image, Button, Form } from "react-bootstrap";
import config from "../config";


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

    const isMyProfile =
        currentUser &&
        profile &&
        currentUser.username?.toLowerCase() === profile.userName?.toLowerCase();

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
    if (loading) return <div>Laddar proofil...</div>
    if (error) return <div>{error}</div>
    if (!profile) return <div>Ingen profil hittades.</div>

    const imageUrl = profile.profileImageUrl ? `${API_BASE_URL}${profile.profileImageUrl}`
        : "https:://via.placeholder.com/150"

    return (
        <Container className="mt-4">
            <Card className="shadow-sm">
                <Card.Body className="p-4">
                    <Row className="align-items-center mb-4">
                        <Col xs="auto">
                            <Image
                                src={imageUrl}
                                alt={profile.userName}
                                roundedCircle
                                thumbnail
                            />
                        </Col>
                        <Col>
                            <h1 className="fw-bold mb-1">{profile.userName}</h1>
                            <div className="d-flex gap-3 text-muted">
                                <span><strong>{profile.followerCount}</strong> Följare</span>
                                <span><strong>{profile.followingCount}</strong> Följer</span>
                            </div>
                        </Col>
                    </Row>
                    <hr className="my-4" />
                    {isEditing ? (
                        <Row>
                            <Col md={8} lg={6}>
                                <h3 className="mb-3">Redigera profil</h3>
                                <Form>
                                    <Form.Group className="mb-3" controlId="formFile">
                                        <Form.Label className="fw-bold">Profilbild</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBio">
                                        <Form.Label className="fw-bold">Bio</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            value={editBio}
                                            onChange={(e) => setEditBio(e.target.value)}
                                            maxLength={500}
                                        />
                                        <Form.Text className="text-muted d-block text-end">
                                            {editBio.length}/500 tecken
                                        </Form.Text>
                                    </Form.Group>

                                    <div className="d-flex gap-2">
                                        <Button variant="primary" onClick={handleUpdateProfile}>
                                            Spara ändringar
                                        </Button>
                                        <Button variant="secondary" onClick={() => setIsEditing(false)}>
                                            Avbryt
                                        </Button>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    ) : (
                        <div className="view-mode">
                            <h5 className="text-uppercase text-muted mb-2 fs-6">Bio</h5>
                            <Card.Text>
                                {profile.bio || <span className="text-muted fst-italic">Den här användaren har ingen bio än.</span>}
                            </Card.Text>

                            <div className="mt-4">
                                {isMyProfile ? (
                                    <Button variant="outline-primary" onClick={() => setIsEditing(true)}>
                                        Redigera Profil
                                    </Button>
                                ) : (
                                    <Button variant="primary" onClick={() => alert("Follow not implemented yet")}>
                                        Följ {profile.userName}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}