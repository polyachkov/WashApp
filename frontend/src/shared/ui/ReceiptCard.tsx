import { View, Text, StyleSheet } from "react-native";
import { AppButton } from "./AppButton";
import { theme } from "@/shared/theme/theme";

type RecieptCardProps = {
    number: number;
    onPress: () => void;
};

export const ReceiptCard = ({
                                number,
                                onPress,
                            }: RecieptCardProps) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                Чек №: {number}
            </Text>

            <AppButton
                title="Подробности"
                onPress={onPress}
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
