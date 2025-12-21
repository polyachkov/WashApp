import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/shared/theme/theme";
import {useMenu} from "@/shared/ui/menu/MenuContext";

export const Header = () => {
    const router = useRouter();
    const { toggle } = useMenu();

    return (
        <View style={styles.header}>
            <Pressable onPress={toggle}>
                <Text style={styles.icon}>≡</Text>
            </Pressable>

            <Text style={styles.balance}>Баллы: 228</Text>

            <Pressable onPress={() => router.replace("/(main)/profile")}>
                <Text style={styles.icon}>👤</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 70,
        backgroundColor: theme.colors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    balance: {
        color: theme.colors.white,
        fontSize: 18,
        fontWeight: "600",
    },
    icon: {
        color: theme.colors.white,
        fontSize: 24,
    },
});
