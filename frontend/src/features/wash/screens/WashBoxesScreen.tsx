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
            <Header />

            {/* Адрес */}
            <View style={styles.address}>
                <Text style={styles.addressText}>
                    Адрес: Новосибирск, Иванова 1, 1
                </Text>

                <AppButton
                    title="На карте"
                    onPress={() => router.push("/map")}
                />
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
});

