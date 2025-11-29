import { Container, Nav, Navbar } from "react-bootstrap";
import logo from "../assets/sn-high-resolution-logo-transparent.png";

export default function Header() {
    return (
        <Navbar bg="success" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand href="/">
                    <img
                        src={logo}
                        alt="Social Network Logo"
                        height="50"
                    />
                </Navbar.Brand>
                <Nav>
                </Nav>
            </Container>
        </Navbar>
    );
}