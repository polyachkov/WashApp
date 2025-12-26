import { apiClient } from "@/shared/api/apiClient";

export type CarWash = {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    created_at?: string;
};

type Page<T> = {
    content: T[];
    page: number;
    size: number;
    total_elements: number;
    total_pages: number;
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
    async list(params?: { search?: string; lat?: number; lng?: number; radius_km?: number }) {
        try {
            const res = await apiClient.get<Page<CarWash>>("/car-washes", { params });
            return res.data;
        } catch {
            // fallback на моки, пока бэк не готов
            return {
                content: MOCK_CAR_WASHES,
                page: 0,
                size: MOCK_CAR_WASHES.length,
                total_elements: MOCK_CAR_WASHES.length,
                total_pages: 1,
            } satisfies Page<CarWash>;
        }
    },
};
