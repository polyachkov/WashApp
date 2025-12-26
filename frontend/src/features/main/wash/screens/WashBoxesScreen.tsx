import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { theme } from "@/shared/theme/theme";
import { AppButton } from "@/shared/ui/AppButton";
import { BoxCard } from "@/shared/ui/BoxCard";
import { selectedCarWashStorage } from "@/shared/storage/selectedCarWash";
import { CarWashesService, CarWash } from "@/features/main/carWashes/services/CarWashesService";
import { BoxesService, WashBox } from "@/features/main/boxes/services/BoxesService";

const MOCK_BOXES: WashBox[] = [
    { id: 1, car_wash_id: 1, number: 1, status: "AVAILABLE" },
    { id: 2, car_wash_id: 1, number: 2, status: "AVAILABLE" },
    { id: 3, car_wash_id: 1, number: 3, status: "BUSY" },
];

export const WashBoxesScreen = () => {
    const router = useRouter();

    const [carWash, setCarWash] = useState<CarWash | null>(null);
    const [boxes, setBoxes] = useState<WashBox[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setErrorText(null);

            try {
                const cwId = await selectedCarWashStorage.get();

                if (!cwId) {
                    setErrorText("Мойка не выбрана");
                    setCarWash({
                        id: 1,
                        name: "Мойка №1",
                        address: "Новосибирск, Иванова 1, 1",
                        latitude: 55.012345,
                        longitude: 82.987654,
                        created_at: "",
                    });
                    setBoxes(MOCK_BOXES);
                    setLoading(false);
                    return;
                }


                const [cw, bx] = await Promise.all([
                    CarWashesService.get(cwId),
                    BoxesService.listByCarWash(cwId, { page: 0, size: 50 }),
                ]);

                if (cancelled) return;
                setCarWash(cw);
                setBoxes(bx.content);
            } catch (e: any) {
                // вместо падения — показываем заглушку
                if (cancelled) return;
                setErrorText(e?.response?.status ? `Ошибка API: ${e.response.status}` : "Ошибка API");
                setBoxes(MOCK_BOXES);
                // адрес тоже можно заглушить
                setCarWash((prev) => prev ?? ({
                    id: 0,
                    name: "—",
                    address: "Новосибирск, Иванова 1, 1",
                    latitude: 0,
                    longitude: 0,
                    created_at: "",
                }));
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const addressText = useMemo(() => {
        if (!carWash) return "Адрес: —";
        return `Адрес: ${carWash.address}`;
    }, [carWash]);

    return (
        <View style={styles.container}>
            <View style={styles.address}>
                <Text style={styles.addressText} numberOfLines={2}>
                    {addressText}
                </Text>

                <View style={styles.mapBtnWrap}>
                    <AppButton title="Карта" onPress={() => router.push("/(main)/wash/map")} />
                </View>
            </View>

            <Text style={styles.title}>Выберите бокс для записи</Text>

            {errorText ? (
                <Text style={styles.errorText}>
                    {errorText}. Показаны мок-данные.
                </Text>
            ) : null}

            <ScrollView contentContainerStyle={styles.list}>
                {boxes.map((box) => (
                    <BoxCard
                        key={String(box.id)}
                        number={box.number}
                        description={""}
                        status={box.status as any}
                        onPress={() => router.replace(`(main)/wash/box?boxId=${box.id}`)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.white },

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
        color: theme.colors.textMuted,
        flex: 1,
        marginRight: 12,
    },

    mapBtnWrap: { width: 100, justifyContent: "center", alignItems: "center" },

    title: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        color: theme.colors.text,
        marginVertical: 16,
    },

    errorText: {
        marginHorizontal: 16,
        marginBottom: 8,
        color: "#B00020",
        fontWeight: "600",
    },

    list: { paddingHorizontal: 16, paddingBottom: 24 },
});
