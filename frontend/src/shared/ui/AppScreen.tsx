import {theme} from "@/shared/theme/theme";
import {View} from "react-native";

export const AppScreen = ({ children }: { children: React.ReactNode }) => (
    <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        backgroundColor: theme.colors.background,
    }}>
        {children}
    </View>
);
