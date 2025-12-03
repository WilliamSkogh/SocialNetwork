import { useAuth } from "../AuthContext";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { useState } from "react";



export default function RegisterPage() {
    const { register } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            return setError("Lösenorden matchar inte.");
        }
        if (password.length < 6) {
            return setError("Lösenordet måste vara minst 6 tecken långt.");
        }
        try {
            setError(null);
            setLoading(true);
            await register(email, password);
        }
        catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
            else {
                setError("Ett okänt fel inträffade.");
            }
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <Container className="d-flex align-items-center justify-content-center mt-5">
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Registrera konto</h2>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email" className="mb-3">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control type="email" name="email" required></Form.Control>
                            </Form.Group>

                            <Form.Group id="password" className="mb-3">
                                <Form.Label>Lösenord:</Form.Label>
                                <Form.Control type="password" name="password" required></Form.Control>
                            </Form.Group>

                            <Form.Group id="confirmPassword" className="mb-3">
                                <Form.Label>Bekräfta lösenord:</Form.Label>
                                <Form.Control type="password" name="confirmPassword" required></Form.Control>
                            </Form.Group>

                            <Button disabled={loading} className="w-100" type="submit">
                                {loading ? 'Registrerar..' : 'Registrera'}</Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    Har du redan ett konto? <a href="/login">Logga in</a>
                </div>
            </div>
        </Container>
    );
}
