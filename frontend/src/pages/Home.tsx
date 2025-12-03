import { Container } from "react-bootstrap";
import { useAuth } from "../AuthContext";

export default function Home() {
    const { user } = useAuth();
    return (
        <Container className="d-flex align-items-center justify-content-center mt-5">
            <h1>Välkommen till startsidan! {user?.username}</h1>
        </Container>
    );
}