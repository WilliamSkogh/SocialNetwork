import { useEffect, useState } from "react";
import { apiClient } from "../services/axiosClient";
import { useAuth } from "../AuthContext";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './PostsPage.css';
import PostCard from "../components/Post/PostCard";
import CreatePostForm from "../components/CreatePost/CreatePostForm";
import AdSidebar from "../components/Sidebar/AdSidebar";

interface Comment {
    id: number;
    userId: string;
    username: string;
    profileImageUrl?: string;
    text: string;
    createdAt: string;
}

interface Post {
    id: number;
    authorId: string;
    authorUsername: string;
    authorProfileImageUrl?: string;
    recipientId?: string;
    recipientUsername?: string;
    recipientProfileImageUrl?: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    likesCount: number;
    dislikesCount: number;
    hasLiked: boolean;
    hasDisliked: boolean;
    comments: Comment[];
}

export default function PostsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'all' | 'following'>('all');
    const [posts, setPosts] = useState<Post[]>([]);

    if (!user) {
        return null;
    }

    useEffect(() => {
        fetchPosts();
    }, [activeTab]);

    const fetchPosts = async () => {
        try {
            const endpoint = activeTab === 'following' ? '/api/posts/following' : '/api/posts';
            const response = await apiClient.get(endpoint);
            setPosts(response.data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        }
    };

    return (
        <div className="posts-page">
            <div className="posts-layout">
                <AdSidebar
                    imageUrl="/src/assets/moverot-ad.png"
                    linkUrl="https://moverot.se"
                    altText="Moverot"
                />

                <div className="posts-container">
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            <i className="bi bi-globe"></i>
                            <span>Alla</span>
                        </button>
                        <button
                            className={`filter-tab ${activeTab === 'following' ? 'active' : ''}`}
                            onClick={() => setActiveTab('following')}
                        >
                            <i className="bi bi-people-fill"></i>
                            <span>Följer</span>
                        </button>
                    </div>

                    <CreatePostForm onPostCreated={fetchPosts} />

                    {posts.length === 0 ? (
                        <div className="no-posts">
                            <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                            <p className="mt-3">Inga inlägg att visa</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
                        ))
                    )}
                </div>

                <AdSidebar
                    imageUrl="/src/assets/flavorly-ad.png"
                    linkUrl="https://flavorly.se"
                    altText="Flavorly"
                />
            </div>
        </div>
    );
}
