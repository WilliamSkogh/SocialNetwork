import { useAuth } from "../AuthContext";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { useState } from "react";



export default function RegisterPage() {
    const { register } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
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
    }

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
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

                            <Button className="w-100" type="submit">Registrera</Button>
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
