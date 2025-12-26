import { View, Text, StyleSheet } from "react-native";
import { AppButton } from "./AppButton";
import { theme } from "@/shared/theme/theme";

type BoxStatus = "ACTIVE" | "CLOSED";

type StssionCardProps = {
    number: number;
    status: BoxStatus;
    onPress: () => void;
};

export const SessionCard = ({
                            number,
                            status,
                            onPress,
                        }: StssionCardProps) => {
    const disabled = status !== "ACTIVE";

    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                Сессия №: {number}
            </Text>

            <Text style={styles.status}>
                Статус: {status === "ACTIVE" ? "активна" : "завершена"}
            </Text>

            <AppButton
                title="Подробности"
                onPress={onPress}
                disabled={disabled}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
    },
    status: {
        fontSize: 16,
        marginBottom: 12,
    },
});
