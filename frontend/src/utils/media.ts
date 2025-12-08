import config from "../config";
import { apiClient } from "../services/axiosClient";

export function buildMediaUrl(path?: string): string | undefined {
    if (!path) return undefined;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    const base = config.apiBaseUrl || apiClient.defaults.baseURL || "https://localhost:7166";
    const cleanBase = base.replace(/\/$/, "");
    
    return `${cleanBase}${path}`;
}
