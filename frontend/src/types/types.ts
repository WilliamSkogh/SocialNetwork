export interface User {
    username: string;
    id: string;
    bio?: string;
    email: string;
    profileImageUrl?: string;
}
export interface UserProfile {
    userName: string;
    bio?: string;
    profileImageUrl?: string;
    followerCount: number;
    followingCount: number;
}
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
