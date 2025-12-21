import { View, Text, StyleSheet } from "react-native";
import { AppButton } from "./AppButton";
import { theme } from "@/shared/theme/theme";

type BoxStatus = "AVAILABLE" | "BUSY";

type BoxCardProps = {
    number: number;
    description: string;
    status: BoxStatus;
    onPress: () => void;
};

export const BoxCard = ({
                            number,
                            description,
                            status,
                            onPress,
                        }: BoxCardProps) => {
    const disabled = status !== "AVAILABLE";

    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                Бокс: {number} ({description})
            </Text>

            <Text style={styles.status}>
                Статус: {status === "AVAILABLE" ? "свободен" : "занят"}
            </Text>

            <AppButton
                title="Записаться"
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
