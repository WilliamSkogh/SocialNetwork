interface PostStatsProps {
    likesCount: number;
    dislikesCount: number;
    commentsCount: number;
}

export default function PostStats({ likesCount, dislikesCount, commentsCount }: PostStatsProps) {
    return (
        <div className="post-stats">
            <span><i className="bi bi-heart-fill"></i> {likesCount} </span>
            <span><i className="bi bi-heartbreak-fill"></i> {dislikesCount} </span>
            <span><i className="bi bi-chat-fill"></i> {commentsCount} </span>
        </div>
    );
}
