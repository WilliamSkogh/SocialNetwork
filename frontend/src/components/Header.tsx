import { Container, Nav, Navbar } from "react-bootstrap";
import logo from "../assets/sn-high-resolution-logo-transparent.png";

export default function Header() {
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
                <Nav>
                </Nav>
            </Container>
        </Navbar >
    );
}