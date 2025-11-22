import {Stack, useRouter} from "expo-router";
import { TouchableOpacity, Text } from "react-native";

export default function AuthLayout() {
    const router = useRouter();

    return (
        <Stack
            screenOptions={{
                headerTitle: "",
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => router.replace("/")}
                        style={{ paddingHorizontal: 16 }}
                    >
                        <Text style={{ fontSize: 16 }}>Назад</Text>
                    </TouchableOpacity>
                ),
            }}
        />
    );
}
