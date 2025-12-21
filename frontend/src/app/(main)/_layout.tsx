import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { MenuProvider } from "@/shared/ui/menu/MenuContext";
import { SideMenu } from "@/shared/ui/menu/SideMenu";
import { Header } from "@/shared/ui/Header";

export default function MainLayout() {
    return (
        <MenuProvider>
            <View style={styles.root}>
                <Header />

                {/* Контент экранов */}
                <View style={styles.content}>
                    <Stack screenOptions={{ headerShown: false }} />
                </View>

                {/* OVERLAY — поверх всего */}
                <SideMenu />
            </View>
        </MenuProvider>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        position: "relative", // 🔥 КЛЮЧЕВО
    },
    content: {
        flex: 1,
    },
});
