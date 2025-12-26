import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/shared/theme/theme";
import { AppButton } from "@/shared/ui/AppButton";
import { Header } from "@/shared/ui/Header";
import { BoxCard } from "@/shared/ui/BoxCard";

const MOCK_BOXES = [
    {
        id: "1",
        number: 1,
        description: "слева от входа",
        status: "AVAILABLE",
    },
    {
        id: "2",
        number: 2,
        description: "первый справа от входа",
        status: "AVAILABLE",
    },
    {
        id: "3",
        number: 3,
        description: "второй справа от входа",
        status: "BUSY",
    },
] as const;

export const WashBoxesScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Адрес */}
            <View style={styles.address}>
                <Text style={styles.addressText}>
                    Адрес: Новосибирск, Иванова 1, 1
                </Text>

                <View style={styles.mapBtnWrap}>
                    <AppButton
                        title="Карта"
                        onPress={() => router.push("/(main)/wash/map")}
                    />
                </View>
            </View>

            <Text style={styles.title}>Выберите бокс для записи</Text>

            <ScrollView contentContainerStyle={styles.list}>
                {MOCK_BOXES.map(box => (
                    <BoxCard
                        key={box.id}
                        number={box.number}
                        description={box.description}
                        status={box.status}
                        onPress={() => router.replace(`(main)/wash/box?boxId=${box.id}`)}
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
        height: 60,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
    },

    addressText: {
        fontSize: 12,
        fontWeight: "700",
        color: theme.colors.textMuted, // как в макете
        flex: 1,
        marginRight: 12,
    },

    mapBtnWrap: {
        width: 100,
        height: 10,
        justifyContent: "center",
        alignItems: "center",   // по горизонтали
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
});

