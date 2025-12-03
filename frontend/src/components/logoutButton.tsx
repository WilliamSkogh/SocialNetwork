import { useAuth } from "../AuthContext";
import { Button } from "react-bootstrap";

export default function LogoutButton() {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Button onClick={handleLogout}>Logga ut</Button>
    );
}