import { theme } from "../theme/theme";
import { StyleSheet, TextInput } from "react-native";

export const AppInput = (props: any) => {
    return <TextInput {...props} style={[styles.input, props.style]} />;
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        padding: 12,
        marginBottom: theme.spacing.md,
        backgroundColor: theme.colors.white,
        color: theme.colors.text,
    },
});
