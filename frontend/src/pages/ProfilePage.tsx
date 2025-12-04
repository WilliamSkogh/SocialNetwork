import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProfilePage() {
    const { username } = useParams();
    const { user: currentUser } = useAuth();

    const isMyProfile = currentUser && username === String(currentUser.username);

    return (
        <div>
            <h1>{isMyProfile ? "Min profil" : `Profil för användare ${username}`}</h1>
            <p>Besöker: {username} | Inloggad som: {currentUser?.username}</p>
        </div>
    );

}

