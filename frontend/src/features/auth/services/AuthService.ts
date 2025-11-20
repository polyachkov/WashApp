import { apiClient } from "@/shared/api/apiClient";
import { tokenStorage } from "@/shared/storage/token";

export const AuthService = {
    async login(email: string, password: string) {
        await tokenStorage.removeToken();
        const response = await apiClient.post("/auth/login", { email, password });
        const token = response.data.token;
        await tokenStorage.saveToken(token);
        return token;
    },

    async register(name: string, email: string, password: string) {
        const response = await apiClient.post("/auth/register", {
            email,
            password
        });
        return response.data;
    },
};
