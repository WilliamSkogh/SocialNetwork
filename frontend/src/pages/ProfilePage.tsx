import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProfilePage() {
    const { username } = useParams();
    const { user: currentUser } = useAuth();

    const isMyProfile = currentUser && username?.toLocaleLowerCase() === currentUser.username?.toLocaleLowerCase();

    return (
        <div className="profile-actions">
            {isMyProfile ? (
                <button>Redigera Profil</button>
            ) : (
                <button>Följ {username}</button>
            )}
        </div>
    );
}
