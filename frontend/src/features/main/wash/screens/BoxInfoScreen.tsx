import { View, Text, StyleSheet, Pressable } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppButton } from "@/shared/ui/AppButton";
import { theme } from "@/shared/theme/theme";
import { selectedCarWashStorage } from "@/shared/storage/selectedCarWash";
import { BoxesService, WashBox } from "@/features/main/boxes/services/BoxesService";

export default function BoxInfoScreen() {
    const router = useRouter();
    const { boxId } = useLocalSearchParams<{ boxId: string }>();

    const [box, setBox] = useState<WashBox | null>(null);

    useEffect(() => {
        (async () => {
            const cwId = await selectedCarWashStorage.get();
            if (!cwId) {
                router.replace("/(main)/wash/map");
                return;
            }
            const b = await BoxesService.getFromSelectedCarWash(cwId, Number(boxId));
            setBox(b);
        })();
    }, [boxId]);

    const statusRu = useMemo(() => {
        switch (box?.status) {
            case "AVAILABLE":
                return "Свободен";
            case "BUSY":
                return "Занят";
            case "OUT_OF_SERVICE":
                return "Не работает";
            default:
                return "—";
        }
    }, [box?.status]);

    return (
        <View style={styles.container}>
            <Pressable onPress={() => router.replace("/(main)/wash")} style={styles.backButton}>
                <Text style={styles.backText}>← Назад</Text>
            </Pressable>

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.title}>Бокс №{box?.number ?? boxId}</Text>

                    <View style={styles.statusWrapper}>
                        <Text style={styles.statusLabel}>Статус:</Text>
                        <Text style={styles.statusValue}>{statusRu}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <AppButton
                    title="Начать сессию"
                    onPress={() => router.back()}
                    disabled={!box || box.status !== "AVAILABLE"}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.white },
    content: { padding: 16 },
    card: { borderWidth: 2, borderColor: theme.colors.primary, borderRadius: 20, padding: 20, gap: 12 },
    title: { fontSize: 24, fontWeight: "700", color: theme.colors.text },
    statusWrapper: { flexDirection: "row", gap: 8, alignItems: "center" },
    statusLabel: { fontSize: 16, fontWeight: "600", color: theme.colors.text },
    statusValue: { fontSize: 16, fontWeight: "700", color: theme.colors.primary },
    footer: { marginTop: "auto", padding: 16 },
    backButton: { paddingHorizontal: 16, paddingVertical: 12 },
    backText: { fontSize: 16, fontWeight: "600", color: theme.colors.primary },
});
