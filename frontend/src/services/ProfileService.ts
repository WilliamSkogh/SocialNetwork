import apiClient from "./axiosClient";
import type { UserProfile } from "../types/types";

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
    }
};