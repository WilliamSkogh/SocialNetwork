interface PostImageProps {
    imageUrl: string;
}

export default function PostImage({ imageUrl }: PostImageProps) {
    const isVideo = imageUrl.endsWith('.mp4') || imageUrl.endsWith('.webm');

    if (isVideo) {
        return (
            <video controls className="post-image">
                <source src={`https://localhost:7166${imageUrl}`} type="video/mp4" />
            </video>
        );
    }

    return (
        <img 
            src={`https://localhost:7166${imageUrl}`} 
            alt="Post"
            className="post-image"
        />
    );
}
