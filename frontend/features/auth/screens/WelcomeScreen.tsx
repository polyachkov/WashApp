import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

export const WelcomeScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Добро пожаловать в WashApp</Text>
        <Text style={styles.subtitle}>Управляйте мойкой легко и удобно</Text>

        {/* Кнопка Войти */}
        <Link href="/(auth)/login" style={styles.button}>
            <Text style={styles.buttonText}>Войти</Text>
        </Link>

        {/* Кнопка Регистрация */}
        <Link href="/(auth)/register" style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Регистрация</Text>
        </Link>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
    subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 40 },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 14,
        borderRadius: 8,
        marginBottom: 12,
        width: "80%",
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    secondaryButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#007AFF",
        paddingVertical: 14,
        borderRadius: 8,
        width: "80%",
        alignItems: "center",
    },
    secondaryButtonText: { color: "#007AFF", fontSize: 16, fontWeight: "bold" },
});
