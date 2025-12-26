import axios from "axios";
import { tokenStorage } from "../storage/token";

export const apiClient = axios.create({
    baseURL: "http://localhost:8080/api/v1", // поменяешь на сервер
    headers: { "Content-Type": "application/json" },
});

const PUBLIC_PATHS = ["/api/v1/auth/login", "/api/v1/auth/register"];

apiClient.interceptors.request.use(async (config) => {
    const url = config.url ?? "";
    const isPublic = PUBLIC_PATHS.some((p) => url.includes(p));
    if (isPublic) {
        delete (config.headers as any)?.Authorization;
        return config;
    }

    const token = await tokenStorage.getToken();
    if (token) (config.headers as any).Authorization = `Bearer ${token}`;
    return config;
});
