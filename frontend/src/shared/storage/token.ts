import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";

export const tokenStorage = {
    async saveToken(token: string) {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (e) {
            console.error("Ошибка сохранения токена:", e);
        }
    },

    async getToken() {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (e) {
            console.error("Ошибка чтения токена:", e);
            return null;
        }
    },

    async removeToken() {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } catch (e) {
            console.error("Ошибка удаления токена:", e);
        }
    },
};
