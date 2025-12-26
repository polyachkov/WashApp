import { apiClient } from "@/shared/api/apiClient";
import type { Page } from "@/shared/api/types";

export type BoxStatus = "AVAILABLE" | "BUSY" | "OUT_OF_SERVICE";

export type WashBox = {
    id: number;
    car_wash_id: number;
    number: number;
    status: BoxStatus;
};

export const BoxesService = {
    // Вариант 1: GET /api/v1/boxes?car_wash_id=10:contentReference[oaicite:5]{index=5}
    // Вариант 2: GET /api/v1/car-washes/{carWashId}/boxes:contentReference[oaicite:6]{index=6}
    async listByCarWash(
        carWashId: number,
        params?: { page?: number; size?: number; preferSubresource?: boolean }
    ) {
        const page = params?.page ?? 0;
        const size = params?.size ?? 50;

        // если бэк позже выберет стиль /car-washes/{id}/boxes — можно переключить флагом
        const path = params?.preferSubresource
            ? `/car-washes/${carWashId}/boxes`
            : "/boxes";

        const res = await apiClient.get<Page<WashBox>>(path, {
            params: params?.preferSubresource
                ? { page, size }
                : { car_wash_id: carWashId, page, size },
        });

        return res.data;
    },

    // В доке нет отдельного GET /boxes/{id}, поэтому “инфу о боксе” берём из списка боксов мойки.
    async getFromSelectedCarWash(carWashId: number, boxId: number) {
        // для MVP обычно боксов мало — тянем одну страницу побольше
        const data = await this.listByCarWash(carWashId, { page: 0, size: 200 });
        const found = data.content.find((b) => b.id === boxId);
        if (!found) throw new Error(`Box ${boxId} not found in carWash ${carWashId}`);
        return found;
    },
};
