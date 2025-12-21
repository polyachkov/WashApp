import {View, Text, StyleSheet, TextInput, Pressable} from "react-native";
import { useRouter } from "expo-router";
import { Header } from "@/shared/ui/Header";
import { AppButton } from "@/shared/ui/AppButton";
import { theme } from "@/shared/theme/theme";

export default function ProfileScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* КНОПКА НАЗАД */}
            <Pressable onPress={() => router.replace("/(main)/wash")} style={styles.backButton}>
                <Text style={styles.backText}>← Назад</Text>
            </Pressable>

            <Text style={styles.title}>Профиль</Text>

            <View style={styles.form}>
                <View style={styles.field}>
                    <Text style={styles.label}>Имя</Text>
                    <TextInput
                        placeholder="Введите имя"
                        style={styles.input}
                        placeholderTextColor={theme.colors.text}
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Телефон</Text>
                    <TextInput
                        placeholder="+7 (___) ___-__-__"
                        style={styles.input}
                        keyboardType="phone-pad"
                        placeholderTextColor={theme.colors.text}
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        placeholder="example@mail.com"
                        style={styles.input}
                        keyboardType="email-address"
                        placeholderTextColor={theme.colors.text}
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <AppButton title="Сохранить" onPress={() => router.back()} />
                <AppButton
                    title="Выйти"
                    variant="secondary"
                    onPress={() => router.replace("/(auth)/login")}
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

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: theme.colors.text,
        textAlign: "center",
        marginVertical: 24,
    },

    form: {
        paddingHorizontal: 16,
        gap: 16,
    },

    field: {
        gap: 6,
    },

    label: {
        fontSize: 14,
        color: theme.colors.text,
    },

    input: {
        height: 52,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        color: theme.colors.text,
    },

    footer: {
        marginTop: "auto",
        padding: 16,
        gap: 12,
    },

    backText: {
        fontSize: 16,
        fontWeight: "600",
        color: theme.colors.primary,
    },

    backButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
});
