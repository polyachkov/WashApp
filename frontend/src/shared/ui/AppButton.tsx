import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

type AppButtonProps = {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary";
};

export const AppButton = ({ title, onPress, variant = "primary" }: AppButtonProps) => (
    <TouchableOpacity
        style={[styles.button, variant === "secondary" && styles.secondary]}
        onPress={onPress}
    >
        <Text
            style={[
                styles.text,
                variant === "secondary" && styles.secondaryText
            ]}
        >
            {title}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 14,
        borderRadius: theme.radius.lg,
        alignItems: "center",
        marginBottom: theme.spacing.md,
        width: "80%",
        alignSelf: "center",
    },
    text: {
        color: theme.colors.white,
        fontSize: 16,
        fontWeight: "600",
    },

    secondary: {
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },

    secondaryText: {
        color: theme.colors.primary,
    },
});
