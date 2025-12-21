import {View, Text, StyleSheet, Pressable} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Header } from "@/shared/ui/Header";
import { AppButton } from "@/shared/ui/AppButton";
import { theme } from "@/shared/theme/theme";

export default function BoxInfoScreen() {
    const router = useRouter();
    const { boxId } = useLocalSearchParams<{ boxId: string }>();

    return (
        <View style={styles.container}>
            {/* КНОПКА НАЗАД */}
            <Pressable onPress={() => router.replace("/(main)/wash")} style={styles.backButton}>
                <Text style={styles.backText}>← Назад</Text>
            </Pressable>

            <View style={styles.content}>
                {/* Карточка бокса */}
                <View style={styles.card}>
                    <Text style={styles.title}>Бокс №{boxId}</Text>
                    <Text style={styles.description}>
                        Бокс находится слева от входа. Подходит для легковых автомобилей.
                    </Text>

                    <View style={styles.statusWrapper}>
                        <Text style={styles.statusLabel}>Статус:</Text>
                        <Text style={styles.statusValue}>Свободен</Text>
                    </View>
                </View>
            </View>

            {/* Кнопка */}
            <View style={styles.footer}>
                <AppButton
                    title="Начать сессию"
                    onPress={() => {
                        // ПОКА НИЧЕГО НЕ СОЗДАЁМ
                        // позже тут будет createSession
                        router.back();
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },

    content: {
        padding: 16,
    },

    card: {
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 20,
        padding: 20,
        gap: 12,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: theme.colors.text,
    },

    description: {
        fontSize: 16,
        color: theme.colors.text,
    },

    statusWrapper: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },

    statusLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: theme.colors.text,
    },

    statusValue: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.colors.primary,
    },

    footer: {
        marginTop: "auto",
        padding: 16,
    },

    backButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    backText: {
        fontSize: 16,
        fontWeight: "600",
        color: theme.colors.primary,
    },
});

