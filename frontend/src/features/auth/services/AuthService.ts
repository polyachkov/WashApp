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

    async register(email: string, password: string, confirmPassword: string) {
        const response = await apiClient.post("/auth/register", {
            email,
            password,
            confirm_password: confirmPassword,
        });

        return response.data;
    },
};
