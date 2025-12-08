export interface User {
    username: string;
    id: string;
    bio?: string;
    email: string;
    profileImageUrl?: string;
}

export interface UserSearchResult {
    id: string;
    username: string;
    profileImageUrl?: string;
    bio?: string;
}
export interface UserProfile {
    userId: string;
    userName: string;
    bio?: string;
    profileImageUrl?: string;
    followerCount: number;
    followingCount: number;
    isFollowing: boolean;
}
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
