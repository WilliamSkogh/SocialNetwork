import { useNavigate } from "react-router-dom";

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
                    src={authorProfileImageUrl ? `https://localhost:7166${authorProfileImageUrl}` : `https://ui-avatars.com/api/?name=${authorUsername.charAt(0)}&background=6c757d&color=fff`}
                    alt={authorUsername}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
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
