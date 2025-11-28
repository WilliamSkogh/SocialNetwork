import axios from "axios";
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
}, (error: unknown) => {
    return Promise.reject(error);
});
export default apiClient;