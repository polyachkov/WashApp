import {View, Text, StyleSheet, ScrollView, Pressable} from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/shared/theme/theme";
import { AppButton } from "@/shared/ui/AppButton";
import { Header } from "@/shared/ui/Header";
import { BoxCard } from "@/shared/ui/BoxCard";
import {SessionCard} from "@/shared/ui/ScreenCard";

const MOCK_SESSIONS = [
    {
        id: "1",
        number: 12133456,
        status: "ACTIVE",
    },
    {
        id: "2",
        number: 23423424,
        status: "CLOSED",
    },
] as const;

export const SessionScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Pressable onPress={() => router.replace("/(main)/wash")} style={styles.backButton}>
                <Text style={styles.backText}>← Назад</Text>
            </Pressable>

            <Text style={styles.title}>Выберите бокс для записи</Text>

            <ScrollView contentContainerStyle={styles.list}>
                {MOCK_SESSIONS.map(session => (
                    <SessionCard
                        key={session.id}
                        number={session.number}
                        status={session.status}
                        // onPress={() => router.replace(`(main)/wash/sessions?sessionId=${sessions.id}`)}
                        onPress={() => print()}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },

    address: {
        margin: 16,
        padding: 12,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    addressText: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.colors.text,
        flex: 1,
        marginRight: 8,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        color: theme.colors.text,
        marginVertical: 16,
    },

    list: {
        paddingHorizontal: 16,
        paddingBottom: 24,
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

