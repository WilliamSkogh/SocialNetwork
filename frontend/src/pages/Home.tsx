import { Container } from "react-bootstrap";
import LogoutButton from "../components/logoutButton";

export default function Home() {
    return (
        <Container className="d-flex align-items-center justify-content-center mt-5">
            <h1>Välkommen till startsidan!</h1>
            <LogoutButton />
        </Container>
    );
}