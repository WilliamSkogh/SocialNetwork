const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

export const storage = {
    getToken: () => localStorage.getItem(ACCESS_TOKEN),
    setToken: (token: string) => localStorage.setItem(ACCESS_TOKEN, token),
    removeToken: () => localStorage.removeItem(ACCESS_TOKEN),

    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN),
    setRefreshToken: (token: string) => localStorage.setItem(REFRESH_TOKEN, token),
    removeRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN)
};
