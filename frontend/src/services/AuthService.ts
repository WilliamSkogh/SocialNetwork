import type { AuthResponse, User } from "../types/types";
import { storage } from "../utils/storage";
import apiClient from "./axiosClient";
import axios from "axios";

export const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>("/auth/login", {
            email,
            password
        });
        return response.data;
    },

    async register(email: string, password: string): Promise<void> {
        try {
            await apiClient.post("/auth/register", { email, password });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorData = error.response.data;
                if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors).flat().join(" ");
                    throw new Error(errorMessages);
                }
                throw new Error(errorData.title || "Registrering misslyckades");
            }
            throw error;
        }
    },

    async getProfile(): Promise<User> {
        const response = await apiClient.get<User>("/api/profile");
        return response.data;
    },

    async logout(): Promise<void> {
        storage.removeToken();
        storage.removeRefreshToken();
    }
};