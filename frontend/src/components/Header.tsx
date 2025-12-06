import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import logo from "../assets/sn-high-resolution-logo-transparent.png";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header.css';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
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
                </Container>
            </Navbar >
        );
    }

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Navbar bg="dark" expand="lg" sticky="top" variant="dark">
            <Container fluid className="d-flex justify-content-between align-items-center">
                <Navbar.Brand href="/" className="">
                    <img
                        src={logo}
                        alt="Social Network Logo"
                        height="50"
                    />
                </Navbar.Brand>
                <Nav>
                    <NavDropdown 
                        title={<i className="bi bi-person-circle" style={{ fontSize: '1.5rem', color: 'white' }}></i>}
                        id="user-dropdown"
                        align="end"
                        drop="down"
                        autoClose={true}
                    >
                        <NavDropdown.Item onClick={() => navigate(`/profile/${user.username}`)}>
                            <span className="d-flex justify-content-between align-items-center">
                                <span>Min profil</span>
                                <i className="bi bi-person ms-2"></i>
                            </span>
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={handleLogout}>
                            <span className="d-flex justify-content-between align-items-center">
                                <span>Logga ut</span>
                                <i className="bi bi-box-arrow-right ms-2"></i>
                            </span>
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar >
    );
}