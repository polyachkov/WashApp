import { apiClient } from "@/shared/api/apiClient";

export type UserMe = {
    id: number;
    email: string;
    role: string; // "USER" | "ADMIN" | ...
    name?: string | null;
    phone?: string | null;
    points?: number | null;
};

export const UsersService = {
    async me(): Promise<UserMe> {
        const { data } = await apiClient.get("/users/me");
        return data as UserMe;
    },
};
