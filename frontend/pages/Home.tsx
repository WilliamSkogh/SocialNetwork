import { Container } from "react-bootstrap";

export default function Home() {
    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <h1>Välkommen till startsidan!</h1>
        </Container>
    );
}