import { AuthResponse, User } from "../types/types";

const API_URL = "http://localhost:5131";

export const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Inloggning misslyckades. Kontrollera uppgifterna.");
        }

        return await response.json();
    },


    async getProfile(token: string): Promise<User> {
        const response = await fetch(`${API_URL}/api/profile`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Kunde inte hämta profil");
        }

        return await response.json();
    }
};