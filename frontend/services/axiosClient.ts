import axios, { AxiosError } from "axios";
import { storage } from "../utils/storage";

export const apiClient = axios.create({
    baseURL: "http://localhost:5131",
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = storage.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
    (error: unknown) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {

        if (error.response?.status === 401) {
            console.warn("Token har gått ut eller är ogiltig. Loggar ut...");
            storage.removeToken();
            storage.removeRefreshToken();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default apiClient;