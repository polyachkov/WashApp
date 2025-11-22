import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { theme } from "@/shared/theme/theme";
import { AppInput } from "@/shared/ui/AppInput";
import { AppButton } from "@/shared/ui/AppButton";
import { AuthService } from "@/features/auth/services/AuthService";

export const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const token = await AuthService.login(email, password);
            console.log("Успешный вход! JWT:", token);
        } catch (e: any) {
            console.log("Ошибка входа:", e.response?.data || e.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Вход</Text>

            <AppInput placeholder="Email" value={email} onChangeText={setEmail} />
            <AppInput
                placeholder="Пароль"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />

            <AppButton title="Войти" onPress={handleLogin} />

            <Link href="/(auth)/register" style={styles.link}>
                <Text style={styles.linkText}>Нет аккаунта? Зарегистрироваться</Text>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: theme.spacing.lg },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: theme.spacing.lg,
        textAlign: "center",
        color: theme.colors.text,
    },
    link: { marginTop: theme.spacing.md, alignItems: "center" },
    linkText: { color: theme.colors.primary },
});
