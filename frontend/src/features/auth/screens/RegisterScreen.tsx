import { View, Text, StyleSheet } from "react-native";
import {Link, router} from "expo-router";
import { useState } from "react";
import { theme } from "@/shared/theme/theme";
import { AppButton } from "@/shared/ui/AppButton";
import { AppInput } from "@/shared/ui/AppInput";
import { AuthService } from "@/features/auth/services/AuthService";

export const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleRegister = async () => {
        try {
            await AuthService.register(name, email, password);

            console.log("Регистрация успешна!");

            router.replace("/(main)/wash");
        } catch (e: any) {
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
    link: { marginTop: theme.spacing.md, alignItems: "center" },
    linkText: { color: theme.colors.primary },
});
