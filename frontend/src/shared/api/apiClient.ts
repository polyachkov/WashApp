import axios from "axios";
import { tokenStorage } from "../storage/token";

export const apiClient = axios.create({
    baseURL: "http://localhost:8080/api/v1", // поменяешь на сервер
    headers: { "Content-Type": "application/json" },
});

// Интерцептор — автоматически вставляет JWT в каждый запрос
apiClient.interceptors.request.use(async (config) => {
    const token = await tokenStorage.getToken();
    console.log("TOKEN FROM ASYNCSTORAGE:", token); // ← СМОТРЕТЬ ЗДЕСЬ

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }

    return config;
});




