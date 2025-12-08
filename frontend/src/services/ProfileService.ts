import apiClient from "./axiosClient";
import axios from "axios";
import type { UserProfile, UserSearchResult } from "../types/types";

export const profiileService = {
    getProfile: async (username: string): Promise<UserProfile> => {
        const response = await apiClient.get<UserProfile>(`/api/users/${username}`)
        return response.data;
    },

    updateProfile: async (username: string, bio: string, file: File | null) => {
        const formData = new FormData();
        formData.append("bio", bio);
        if (file) {
            formData.append("profileImage", file);
        }
        const response = await apiClient.put(`/api/users/${username}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        return response.data;
    },

    followUser: async (userId: string) => {
        const response = await apiClient.post(`/api/users/${userId}/follow`);
        return response.data;
    },

    unfollowUser: async (userId: string) => {
        const response = await apiClient.delete(`/api/users/${userId}/unfollow`);
        return response.data;
    },

    searchUsers: async (query: string): Promise<UserSearchResult[]> => {
        if (!query.trim()) return [];

        try {
            const response = await apiClient.get<UserSearchResult[]>(`/api/users/search`, {
                params: { query }
            });
            return response.data.map((item: any) => ({
                id: item.id ?? item.userId ?? "",
                username: item.username ?? item.userName ?? "",
                profileImageUrl: item.profileImageUrl,
                bio: item.bio
            })).filter(u => u.id && u.username);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return [];
            }
            throw error;
        }
    }
};
