interface PostContentProps {
    authorUsername: string;
    content: string;
    createdAt: string;
}

export default function PostContent({ authorUsername, content, createdAt }: PostContentProps) {
    return (
        <div className="post-content">
            <p><strong>{authorUsername}</strong> {content}</p>
            <small style={{color: 'var(--text-secondary)'}}>
                {new Date(createdAt).toLocaleString()}
            </small>
        </div>
    );
}
