import { apiClient } from "@/shared/api/apiClient";
import type { CarWash } from "@/features/main/carWashes/services/CarWashesService";
import type { WashBox } from "@/features/main/boxes/services/BoxesService";

export type CreateCarWashBody = {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
};

export type CreateBoxBody = {
    car_wash_id: number;
    number: number;
    description?: string;
    status?: "AVAILABLE" | "BUSY";
};

export const AdminService = {
    async createCarWash(body: CreateCarWashBody): Promise<CarWash> {
        const { data } = await apiClient.post("/car-washes", body);
        return data as CarWash;
    },

    async createBox(body: CreateBoxBody): Promise<WashBox> {
        const { data } = await apiClient.post("/boxes", body);
        return data as WashBox;
    },
};
