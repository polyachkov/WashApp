import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "selected_car_wash_id";

export const selectedCarWashStorage = {
    async set(id: number) {
        await AsyncStorage.setItem(KEY, String(id));
    },
    async get(): Promise<number | null> {
        const v = await AsyncStorage.getItem(KEY);
        return v ? Number(v) : null;
    },
    async clear() {
        await AsyncStorage.removeItem(KEY);
    },
};
