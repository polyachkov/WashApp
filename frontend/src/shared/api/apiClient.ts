import axios from "axios";
import { tokenStorage } from "../storage/token";

export const apiClient = axios.create({
    baseURL: "http://localhost:8080/api", // поменяешь на сервер
    headers: { "Content-Type": "application/json" },
});

// Интерцептор — автоматически вставляет JWT в каждый запрос
apiClient.interceptors.request.use(async (config) => {
    const token = await tokenStorage.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
