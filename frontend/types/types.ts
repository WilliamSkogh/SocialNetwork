export interface User {
    id: string;
    email: string;
    username: string;
    bio?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}