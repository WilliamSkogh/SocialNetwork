import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/sn-high-resolution-logo-transparent.png";
import LogoutButton from "./logoutButton";
import { useAuth } from "../AuthContext";

export default function Header() {
    const { user } = useAuth();
    
    return (
        <Navbar bg="dark" expand="lg" sticky="top">
            <Container fluid>
                <Navbar.Brand href="/" className="">
                    <img
                        src={logo}
                        alt="Social Network Logo"
                        height="50"
                    />
                </Navbar.Brand>
                <Nav className="me-auto">
                    {user && (
                        <>
                            <Nav.Link as={Link} to="/" style={{ color: 'white' }}>
                                Hem
                            </Nav.Link>
                            <Nav.Link as={Link} to="/messages" style={{ color: 'white' }}>
                                Meddelanden
                            </Nav.Link>
                        </>
                    )}
                </Nav>
                <Nav>
                    <LogoutButton />
                </Nav>
            </Container>
        </Navbar >
    );
}