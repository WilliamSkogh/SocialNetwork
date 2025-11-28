import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "./types/types";
import { authService } from "./services/AuthService";
import { storage } from "./utils/storage";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const logout = () => {
        storage.removeToken();
        storage.removeRefreshToken();
        setUser(null);
        navigate("/login");
    };

    const loadUserProfile = async (token: string) => {
        try {
            const userData = await authService.getProfile(token);
            setUser(userData);
        } catch (error) {
            console.error(error);
            logout();
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = storage.getToken();
            if (token) {
                await loadUserProfile(token);
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const data = await authService.login(email, password);

        storage.setToken(data.accessToken);
        storage.setRefreshToken(data.refreshToken);

        await loadUserProfile(data.accessToken);
        navigate("/");
    };

    const register = async (email: string, password: string) => {
        await authService.register(email, password);

        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};