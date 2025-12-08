import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Container, Form, Nav, Navbar, NavDropdown, Spinner } from "react-bootstrap";
import logo from "../assets/sn-high-resolution-logo-transparent.png";
import { Link } from "react-router-dom";

import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/Header.css'
import { useTheme } from "../ThemeContext";
import { profiileService } from "../services/ProfileService";
import type { UserSearchResult } from "../types/types";
import { buildMediaUrl } from "../utils/media";
import ActivityFeed from "./ActivityFeed/ActivityFeed";

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showActivity, setShowActivity] = useState(false);
    const searchDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const searchBoxRef = useRef<HTMLDivElement | null>(null);
    const activityRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
            if (activityRef.current && !activityRef.current.contains(event.target as Node)) {
                setShowActivity(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    useEffect(() => {
        if (searchDelayRef.current) {
            clearTimeout(searchDelayRef.current);
        }

        if (!searchTerm.trim() || searchTerm.trim().length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        searchDelayRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const results = await profiileService.searchUsers(searchTerm.trim());
                setSearchResults(results);
                setShowResults(true);
            } catch (error) {
                console.error("Failed to search users", error);
                setSearchResults([]);
                setShowResults(true);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => {
            if (searchDelayRef.current) {
                clearTimeout(searchDelayRef.current);
            }
        };
    }, [searchTerm]);

    const handleSelectUser = (username: string) => {
        setSearchTerm("");
        setSearchResults([]);
        setShowResults(false);
        navigate(`/profile/${username}`);
    };

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && searchResults[0]) {
            event.preventDefault();
            handleSelectUser(searchResults[0].username);
        }
    };

    if (!user) {
        return (
            <Navbar
                expand="lg"
                sticky="top"
                variant={theme === 'light' ? 'light' : 'dark'}
                className={`app-header ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
            >
                <Container fluid className="d-flex justify-content-between align-items-center header-container">
                    <Navbar.Brand href="/login" className="header-brand">
                        <img
                            src={logo}
                            alt="Social Network Logo"
                            height="50"
                        />
                    </Navbar.Brand>
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        aria-label="Byt tema"
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
        <Navbar
            expand="lg"
            sticky="top"
            variant={theme === 'light' ? 'light' : 'dark'}
            className={`app-header ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
        >
            <Container fluid className="header-container">
                <Navbar.Brand href="/" className="header-brand">
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

                <div className="header-search" ref={searchBoxRef}>
                    <div className="search-input-wrapper">
                        <i className="bi bi-search search-icon" aria-hidden="true"></i>
                        <Form.Control
                            type="search"
                            placeholder="Search for users"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => searchResults.length > 0 && setShowResults(true)}
                            onKeyDown={handleSearchKeyDown}
                            className="search-input"
                            aria-label="Search users"
                        />
                        {searchTerm && !isSearching && (
                            <button
                                type="button"
                                className="clear-search-btn"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSearchResults([]);
                                    setShowResults(false);
                                }}
                                aria-label="Clear search"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        )}
                        {isSearching && (
                            <div className="search-spinner" aria-label="Searching">
                                <Spinner animation="border" size="sm" />
                            </div>
                        )}
                    </div>

                    {showResults && (
                        <div className="search-results">
                            {isSearching ? (
                                <div className="search-status">Söker...</div>
                            ) : searchResults.length === 0 ? (
                                <div className="search-status">Inga användare hittades</div>
                            ) : (
                                searchResults.map((result) => (
                                    <button
                                        type="button"
                                        key={result.id}
                                        className="search-result"
                                        onClick={() => handleSelectUser(result.username)}
                                    >
                                        {buildMediaUrl(result.profileImageUrl) ? (
                                            <img
                                                src={buildMediaUrl(result.profileImageUrl)}
                                                alt={`${result.username} avatar`}
                                                className="result-avatar"
                                            />
                                        ) : (
                                            <div className="result-avatar placeholder" aria-hidden="true">
                                                <i className="bi bi-person-fill"></i>
                                            </div>
                                        )}
                                        <div className="result-text">
                                            <span className="result-name">{result.username}</span>
                                            {result.bio && (
                                                <span className="result-meta">
                                                    {result.bio.length > 60 ? `${result.bio.slice(0, 60)}...` : result.bio}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <Nav className="header-actions">
                    <div ref={activityRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowActivity(!showActivity)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--header-text)',
                                fontSize: '24px',
                                cursor: 'pointer',
                                padding: '0 10px'
                            }}
                        >
                            <i className="bi bi-bell"></i>
                        </button>
                        {showActivity && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '8px',
                                width: 'min(400px, 90vw)',
                                maxHeight: '500px',
                                overflowY: 'auto',
                                backgroundColor: 'white',
                                border: '1px solid #dbdbdb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                zIndex: 1000
                            }}>
                                <ActivityFeed />
                            </div>
                        )}
                    </div>
                    <NavDropdown
                        title={<i className="bi bi-person-circle profile-trigger" aria-hidden="true"></i>}
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
