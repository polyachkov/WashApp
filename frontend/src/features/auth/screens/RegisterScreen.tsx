import { tokenStorage } from "@/shared/storage/token";
import { AuthService } from "@/features/auth/services/AuthService";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

export const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleRegister = async () => {
        try {
            await AuthService.register(name, email, password);
            console.log("Регистрация успешна!");

            // TODO — добавим redirect в login позже
        } catch (e: any) {
            console.log("Ошибка регистрации:", e.response?.data || e.message);
        }
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Регистрация</Text>

            <TextInput style={styles.input} placeholder="Имя" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput
                style={styles.input}
                placeholder="Пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Подтвердите пароль"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Зарегистрироваться</Text>
            </TouchableOpacity>


            <Link href="/(auth)/login" style={styles.link}>
                <Text style={styles.linkText}>Уже есть аккаунт? Войти</Text>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 24 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16 },
    button: { backgroundColor: "#007AFF", padding: 14, borderRadius: 8, alignItems: "center" },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    link: { marginTop: 16, alignItems: "center" },
    linkText: { color: "#007AFF" },
});
