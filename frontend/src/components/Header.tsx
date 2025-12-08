import { Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import logo from "../assets/sn-high-resolution-logo-transparent.png";
import { Link } from "react-router-dom";

import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header.css';
import { useTheme } from "../ThemeContext";

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    if (!user) {
        return (
            <Navbar bg="dark" expand="lg" sticky="top" variant="dark">
                <Container fluid className="d-flex justify-content-between align-items-center">
                    <Navbar.Brand href="/login" className="">
                        <img
                            src={logo}
                            alt="Social Network Logo"
                            height="50"
                        />
                    </Navbar.Brand>
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            color: 'white',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <i className={`bi ${theme === 'light' ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`}></i>
                    </button>
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
                <Nav className="me-auto">
                    {user && (
                        <>
                            <Nav.Link as={Link} to="/messages" style={{ color: 'white' }}>
                                Meddelanden
                            </Nav.Link>
                        </>
                    )}
                </Nav>
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
                        <NavDropdown.Item onClick={toggleTheme}>
                            <span className="d-flex justify-content-between align-items-center">
                                <span>{theme === 'light' ? 'Mörkt läge' : 'Ljust läge'}</span>
                                <i className={`bi ${theme === 'light' ? 'bi-moon-stars' : 'bi-sun'} ms-2`}></i>
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