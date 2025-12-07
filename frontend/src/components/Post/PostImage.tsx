import { useEffect, useRef, useState } from "react";

interface PostImageProps {
    imageUrl: string;
}

export default function PostImage({ imageUrl }: PostImageProps) {
    const isVideo = imageUrl.endsWith('.mp4') || imageUrl.endsWith('.webm');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        video.play().then(() => setIsPlaying(true)).catch(() => {});
                    } else {
                        video.pause();
                        setIsPlaying(false);
                    }
                });
            },
            { threshold: 1.0 } 
        );

        observer.observe(video);

        return () => observer.disconnect();
    }, []);

    const handleVideoClick = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    if (isVideo) {
        return (
            <div style={{ position: 'relative' }}>
                <video 
                    ref={videoRef}
                    className="post-image"
                    loop
                    muted
                    playsInline
                    onClick={handleVideoClick}
                    style={{ cursor: 'pointer' }}
                >
                    <source src={`https://localhost:7166${imageUrl}`} type="video/mp4" />
                </video>
                
                {!isPlaying && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: '50%',
                            width: '60px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        <i className="bi bi-play-fill" style={{ fontSize: '2rem', color: 'white', marginLeft: '4px' }}></i>
                    </div>
                )}
            </div>
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
