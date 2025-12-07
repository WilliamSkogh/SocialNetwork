import { useEffect, useRef, useState } from "react";

interface PostImageProps {
    imageUrl: string;
}

export default function PostImage({ imageUrl }: PostImageProps) {
    const isVideo = imageUrl.endsWith('.mp4') || imageUrl.endsWith('.webm');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolume] = useState(1);

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

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        videoRef.current.muted = newMutedState;
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            if (newVolume === 0) {
                setIsMuted(true);
                videoRef.current.muted = true;
            } else if (isMuted) {
                setIsMuted(false);
                videoRef.current.muted = false;
            }
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

                <div
                    style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        backdropFilter: 'blur(4px)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={toggleMute}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <i className={`bi ${isMuted || volume === 0 ? 'bi-volume-mute-fill' : volume < 0.5 ? 'bi-volume-down-fill' : 'bi-volume-up-fill'}`}></i>
                    </button>
                    
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        style={{
                            width: '80px',
                            cursor: 'pointer',
                            accentColor: 'white'
                        }}
                    />
                </div>
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
