import { useNavigate } from "react-router-dom";
import { buildMediaUrl } from "../../utils/media";

interface PostHeaderProps {
    authorUsername: string;
    authorProfileImageUrl?: string;
    recipientUsername?: string;
    canDelete: boolean;
    onDelete: () => void;
}

export default function PostHeader({ 
    authorUsername, 
    authorProfileImageUrl, 
    recipientUsername, 
    canDelete, 
    onDelete 
}: PostHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="post-header">
            <div className="post-author">
                <img 
                    src={buildMediaUrl(authorProfileImageUrl) ?? "https://via.placeholder.com/40"}
                    alt={authorUsername}
                />
                <div>
                    <span onClick={() => navigate(`/profile/${authorUsername}`)}>
                        {authorUsername}
                    </span>
                    {recipientUsername && (
                        <>
                            <span style={{color: 'var(--text-secondary)'}} className="mx-1">→</span>
                            <span onClick={() => navigate(`/profile/${recipientUsername}`)}>
                                {recipientUsername}
                            </span>
                        </>
                    )}
                </div>
            </div>
            {canDelete && (
                <button onClick={onDelete} className="delete-btn">
                    <i className="bi bi-trash"></i> Ta bort
                </button>
            )}
        </div>
    );
}
