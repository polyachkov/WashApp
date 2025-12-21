import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    Dimensions,
} from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { useMenu } from "./MenuContext";
import { theme } from "@/shared/theme/theme";

const { width, height } = Dimensions.get("window");

const HEADER_HEIGHT = 70;
const MENU_WIDTH = 351; // как в Figma

export const SideMenu = () => {
    const { isOpen, close } = useMenu();
    const router = useRouter();

    const translateX = useRef(new Animated.Value(-MENU_WIDTH)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: isOpen ? 0 : -MENU_WIDTH,
                duration: 250,
                useNativeDriver: false,
            }),
            Animated.timing(backdropOpacity, {
                toValue: isOpen ? 1 : 0,
                duration: 250,
                useNativeDriver: false,
            }),
        ]).start();
    }, [isOpen]);

    // меню существует всегда, но визуально скрыто
    return (
        <View pointerEvents={isOpen ? "auto" : "none"} style={StyleSheet.absoluteFill}>
            {/* Затемнение */}
            <Animated.View
                style={[
                    styles.backdrop,
                    { opacity: backdropOpacity },
                ]}
            >
                <Pressable style={StyleSheet.absoluteFill} onPress={close} />
            </Animated.View>

            {/* Меню */}
            <Animated.View
                style={[
                    styles.menu,
                    { transform: [{ translateX }] },
                ]}
            >
                <MenuItem
                    title="Выбрать бокс"
                    onPress={() => {
                        router.push("/wash");
                        close();
                    }}
                />

                <MenuItem
                    title="Мои сессии"
                    onPress={() => {
                        router.push("/sessions");
                        close();
                    }}
                />

                <MenuItem
                    title="Чеки"
                    onPress={() => {
                        router.push("/receipts");
                        close();
                    }}
                />

                <MenuItem
                    title="Поддержка"
                    onPress={() => {
                        console.log("Поддержка");
                        close();
                    }}
                />
            </Animated.View>
        </View>
    );
};

const MenuItem = ({
                      title,
                      onPress,
                  }: {
    title: string;
    onPress: () => void;
}) => (
    <Pressable style={styles.item} onPress={onPress}>
        <Text style={styles.itemText}>{title}</Text>
    </Pressable>
);


const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    menu: {
        position: "absolute",
        top: HEADER_HEIGHT,
        left: 0,
        width: MENU_WIDTH,
        height: height - HEADER_HEIGHT,
        backgroundColor: "#D9D9D9",
        paddingTop: 20,
    },

    item: {
        height: 61,
        marginHorizontal: 8,
        marginVertical: 8,
        backgroundColor: theme.colors.primary,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },

    itemText: {
        fontSize: 24,
        fontWeight: "400",
        color: theme.colors.white,
    },
});

