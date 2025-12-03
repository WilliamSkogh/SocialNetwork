import { useAuth } from "../AuthContext";
import { Button } from "react-bootstrap";

export default function LogoutButton() {
    const { user } = useAuth();
    const { logout } = useAuth();
    if (!user) {
        return null;
    }

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Button onClick={handleLogout}>Logga ut</Button>
    );
}