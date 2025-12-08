interface PostContentProps {
    authorUsername: string;
    content: string;
    createdAt: string;
}

export default function PostContent({ authorUsername, content, createdAt }: PostContentProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('sv-SE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="post-content">
            <p><strong>{authorUsername}</strong> {content}</p>
            <small style={{color: 'var(--text-secondary)'}}>
                {formatDate(createdAt)}
            </small>
        </div>
    );
}
