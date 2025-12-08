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
    const [isFullscreen, setIsFullscreen] = useState(false);

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

    const openFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFullscreen(true);
    };

    const closeFullscreen = () => {
        setIsFullscreen(false);
    };

    if (isVideo) {
        return (
            <>
                <div style={{ position: 'relative' }}>
                    <video 
                        ref={videoRef}
                        className="post-image"
                        loop
                        muted
                        playsInline
                        onClick={handleVideoClick}
                        onDoubleClick={openFullscreen}
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

                    <button
                        onClick={openFullscreen}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(0, 0, 0, 0.7)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            padding: '8px 12px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <i className="bi bi-arrows-fullscreen"></i>
                    </button>
                </div>

                {isFullscreen && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'rgba(0, 0, 0, 0.95)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={closeFullscreen}
                    >
                        <button
                            onClick={closeFullscreen}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '2rem',
                                padding: '10px 20px',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <i className="bi bi-x"></i>
                        </button>
                        <video
                            src={`https://localhost:7166${imageUrl}`}
                            controls
                            autoPlay
                            style={{
                                maxWidth: '90vw',
                                maxHeight: '90vh',
                                objectFit: 'contain'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            <div style={{ position: 'relative' }}>
                <img 
                    src={`https://localhost:7166${imageUrl}`} 
                    alt="Post"
                    className="post-image"
                    onClick={openFullscreen}
                    style={{ cursor: 'pointer' }}
                />
                <button
                    onClick={openFullscreen}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <i className="bi bi-arrows-fullscreen"></i>
                </button>
            </div>

            {isFullscreen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0, 0, 0, 0.95)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={closeFullscreen}
                >
                    <button
                        onClick={closeFullscreen}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '2rem',
                            padding: '10px 20px',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <i className="bi bi-x"></i>
                    </button>
                    <img
                        src={`https://localhost:7166${imageUrl}`}
                        alt="Post fullscreen"
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            objectFit: 'contain'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}
