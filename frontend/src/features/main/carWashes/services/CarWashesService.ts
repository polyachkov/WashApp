import { apiClient } from "@/shared/api/apiClient";
import {Page} from "@/shared/api/types";

export type CarWash = {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    created_at?: string;
};


const MOCK_CAR_WASHES: CarWash[] = [
    {
        id: 10,
        name: "Мойка №1",
        address: "г. Новосибирск, ул. Пушкина, д. 10",
        latitude: 55.012345,
        longitude: 82.987654,
    },
    {
        id: 11,
        name: "Мойка №2",
        address: "г. Новосибирск, ул. Ленина, д. 5",
        latitude: 55.0201,
        longitude: 82.935,
    },
];

export const CarWashesService = {
    // GET /api/v1/car-washes?page&size&search  (search — по имени/адресу):contentReference[oaicite:3]{index=3}
    async list(params?: { page?: number; size?: number; search?: string }) {
        const res = await apiClient.get<Page<CarWash>>("/car-washes", {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 20,
                ...(params?.search ? { search: params.search } : {}),
            },
        });
        return res.data;
    },

    // GET /api/v1/car-washes/{id}:contentReference[oaicite:4]{index=4}
    async get(id: number) {
        const res = await apiClient.get<CarWash>(`/car-washes/${id}`);
        return res.data;
    },
};
