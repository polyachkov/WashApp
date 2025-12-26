import { View, Text, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { theme } from "@/shared/theme/theme";
import { AppButton } from "@/shared/ui/AppButton";
import { AppInput } from "@/shared/ui/AppInput";
import { AuthService } from "@/features/auth/services/AuthService";

export const RegisterScreen = () => {
    const [name, setName] = useState(""); // пока оставим, но в API не шлём
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async () => {
        setError(null);

        if (!email || !password || !confirm) {
            setError("Заполните email и пароль");
            return;
        }

        if (password !== confirm) {
            setError("Пароли не совпадают");
            return;
        }

        try {
            await AuthService.register(email, password, confirm);

            // авто-вход после успешной регистрации
            await AuthService.login(email, password);

            router.replace("/(main)/wash");
        } catch (e: any) {
            const msg =
                e?.response?.data?.error?.message ||
                e?.response?.data?.message ||
                e?.message ||
                "Ошибка регистрации";
            setError(msg);
            console.log("Ошибка регистрации:", e.response?.data || e.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Регистрация</Text>

            <AppInput placeholder="Имя" value={name} onChangeText={setName} />
            <AppInput placeholder="Email" value={email} onChangeText={setEmail} />
            <AppInput
                placeholder="Пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <AppInput
                placeholder="Подтвердите пароль"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <AppButton title="Зарегистрироваться" onPress={handleRegister} />

            <Link href="/(auth)/login" style={styles.link}>
                <Text style={styles.linkText}>Уже есть аккаунт? Войти</Text>
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
    error: {
        color: "red",
        textAlign: "center",
        marginBottom: theme.spacing.md,
    },
    link: { marginTop: theme.spacing.md, alignItems: "center" },
    linkText: { color: theme.colors.primary },
});
