import config from "../config";
import { apiClient } from "../services/axiosClient";

export function buildMediaUrl(path?: string): string | undefined {
    if (!path) return undefined;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    const base = (config.apiBaseUrl || apiClient.defaults.baseURL || "").replace(/\/$/, "");
    if (!base) return path;

    return `${base}${path}`;
}
