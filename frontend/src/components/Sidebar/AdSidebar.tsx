interface AdSidebarProps {
    imageUrl: string;
    linkUrl: string;
    altText: string;
}

export default function AdSidebar({ imageUrl, linkUrl, altText }: AdSidebarProps) {
    return (
        <div className="sidebar-ad">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                <img src={imageUrl} alt={altText} className="ad-image" />
            </a>
        </div>
    );
}
