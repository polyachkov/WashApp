import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/shared/theme/theme";
import { AppButton } from "@/shared/ui/AppButton";
import {AppScreen} from "@/shared/ui/AppScreen";

export const WelcomeScreen = () => {
    const router = useRouter();

    return (
        <AppScreen>
            <Text style={styles.title}>Добро пожаловать в WashApp</Text>
            <Text style={styles.subtitle}>Управляйте мойкой легко и удобно</Text>

            <AppButton
                title="Войти"
                onPress={() => router.push("/(auth)/login")}
            />

            <AppButton
                title="Регистрация"
                onPress={() => router.push("/(auth)/register")}
                variant="secondary"
            />
        </AppScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        backgroundColor: theme.colors.background,
    },

    title: {
        fontSize: 30,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 12,
    },

    subtitle: {
        fontSize: 16,
        color: theme.colors.textMuted,
        textAlign: "center",
        marginBottom: 40,
        maxWidth: 280,
    },

    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 14,
        borderRadius: theme.radius.lg,
        marginBottom: 12,
        width: "80%",
        alignItems: "center",
    },

    buttonText: { color: theme.colors.white, fontSize: 16, fontWeight: "bold" },

    secondaryButton: {
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        paddingVertical: 14,
        borderRadius: theme.radius.lg,
        width: "80%",
        alignItems: "center",
    },
    secondaryButtonText: { color: theme.colors.primary, fontSize: 16, fontWeight: "bold" },
});
