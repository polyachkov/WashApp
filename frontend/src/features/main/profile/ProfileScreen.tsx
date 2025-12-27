import { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/shared/theme/theme";
import { AppButton } from "@/shared/ui/AppButton";

import { UsersService, UserMe } from "@/features/auth/services/UsersService";
import { CarWashesService, CarWash } from "@/features/main/carWashes/services/CarWashesService";
import { BoxesService, WashBox } from "@/features/main/boxes/services/BoxesService";
import { AdminService } from "@/features/admin/services/AdminService";

const DEV_ROLES = ["ADMIN", "DEVELOPER"];

function parseNum(v: string): number | null {
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : null;
}

export default function ProfileScreen() {
    const router = useRouter();

    const [me, setMe] = useState<UserMe | null>(null);
    const [loadingMe, setLoadingMe] = useState(true);
    const [meError, setMeError] = useState<string | null>(null);

    const [carWashes, setCarWashes] = useState<CarWash[]>([]);
    const [selectedWashId, setSelectedWashId] = useState<number | null>(null);
    const [boxes, setBoxes] = useState<WashBox[]>([]);

    const [loadingWashes, setLoadingWashes] = useState(false);
    const [loadingBoxes, setLoadingBoxes] = useState(false);
    const [adminError, setAdminError] = useState<string | null>(null);

    const [cwName, setCwName] = useState("");
    const [cwAddress, setCwAddress] = useState("");
    const [cwLat, setCwLat] = useState("");
    const [cwLng, setCwLng] = useState("");

    const [boxNumber, setBoxNumber] = useState("");
    const [boxDesc, setBoxDesc] = useState("");
    const [boxStatus, setBoxStatus] = useState<"AVAILABLE" | "BUSY">("AVAILABLE");

    const isDev = useMemo(() => {
        const role = me?.role ?? "";
        return DEV_ROLES.includes(role);
    }, [me?.role]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoadingMe(true);
            setMeError(null);

            try {
                const u = await UsersService.me();
                if (cancelled) return;
                setMe(u);
            } catch (e: any) {
                if (cancelled) return;

                const status = e?.response?.status;
                if (status === 401) {
                    router.replace("/(auth)/login");
                    return;
                }
                setMeError(status ? `Ошибка профиля: ${status}` : "Ошибка профиля");
            } finally {
                if (!cancelled) setLoadingMe(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const loadCarWashes = async () => {
        setLoadingWashes(true);
        setAdminError(null);

        try {
            const page = await CarWashesService.list();
            const content = (page as any)?.content ?? [];
            setCarWashes(content);

            if (!selectedWashId && content[0]?.id) {
                setSelectedWashId(content[0].id);
            }
        } catch (e: any) {
            const status = e?.response?.status;
            setAdminError(status ? `Ошибка /car-washes: ${status}` : "Ошибка /car-washes");
            setCarWashes([]);
        } finally {
            setLoadingWashes(false);
        }
    };

    const loadBoxes = async (washId: number) => {
        setLoadingBoxes(true);
        setAdminError(null);

        try {
            const page = await BoxesService.listByCarWash(washId, { page: 0, size: 50 });
            const content = (page as any)?.content ?? [];
            setBoxes(content);
        } catch (e: any) {
            const status = e?.response?.status;
            setAdminError(status ? `Ошибка /boxes: ${status}` : "Ошибка /boxes");
            setBoxes([]);
        } finally {
            setLoadingBoxes(false);
        }
    };

    useEffect(() => {
        if (!isDev) return;
        loadCarWashes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDev]);

    useEffect(() => {
        if (!isDev) return;
        if (!selectedWashId) return;
        loadBoxes(selectedWashId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDev, selectedWashId]);

    const handleCreateCarWash = async () => {
        setAdminError(null);

        const lat = parseNum(cwLat);
        const lng = parseNum(cwLng);

        if (!cwName.trim() || !cwAddress.trim() || lat === null || lng === null) {
            setAdminError("Заполни имя/адрес и координаты (latitude/longitude).");
            return;
        }

        try {
            const created = await AdminService.createCarWash({
                name: cwName.trim(),
                address: cwAddress.trim(),
                latitude: lat,
                longitude: lng,
            });

            setCwName("");
            setCwAddress("");
            setCwLat("");
            setCwLng("");

            await loadCarWashes();
            setSelectedWashId(created.id);
        } catch (e: any) {
            const status = e?.response?.status;
            setAdminError(status ? `Ошибка создания мойки: ${status}` : "Ошибка создания мойки");
        }
    };

    const handleCreateBox = async () => {
        setAdminError(null);

        if (!selectedWashId) {
            setAdminError("Сначала выбери мойку.");
            return;
        }

        const num = parseNum(boxNumber);
        if (num === null) {
            setAdminError("Номер бокса должен быть числом.");
            return;
        }

        try {
            await AdminService.createBox({
                car_wash_id: selectedWashId,
                number: num,
                description: boxDesc.trim() ? boxDesc.trim() : undefined,
                status: boxStatus,
            });

            setBoxNumber("");
            setBoxDesc("");
            setBoxStatus("AVAILABLE");

            await loadBoxes(selectedWashId);
        } catch (e: any) {
            const status = e?.response?.status;
            setAdminError(status ? `Ошибка создания бокса: ${status}` : "Ошибка создания бокса");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Pressable onPress={() => router.replace("/(main)/wash")} style={styles.backButton}>
                    <Text style={styles.backText}>← Назад</Text>
                </Pressable>

                <Text style={styles.title}>Профиль</Text>

                {loadingMe ? (
                    <View style={styles.centerRow}>
                        <ActivityIndicator />
                        <Text style={styles.hint}>Загрузка профиля…</Text>
                    </View>
                ) : null}

                {meError ? <Text style={styles.errorText}>{meError}</Text> : null}

                {me ? (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Текущий пользователь</Text>
                        <Text style={styles.meta}>Email: {me.email}</Text>
                        <Text style={styles.meta}>Роль: {me.role}</Text>
                        {"points" in me ? <Text style={styles.meta}>Баллы: {me.points ?? 0}</Text> : null}
                    </View>
                ) : null}

                <View style={styles.form}>
                    <View style={styles.field}>
                        <Text style={styles.label}>Имя</Text>
                        <TextInput
                            placeholder="Введите имя"
                            style={styles.input}
                            placeholderTextColor={theme.colors.text}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Телефон</Text>
                        <TextInput
                            placeholder="+7 (___) ___-__-__"
                            style={styles.input}
                            keyboardType="phone-pad"
                            placeholderTextColor={theme.colors.text}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            value={me?.email ?? ""}
                            editable={false}
                            style={[styles.input, { opacity: 0.8 }]}
                            keyboardType="email-address"
                            placeholder="example@mail.com"
                            placeholderTextColor={theme.colors.text}
                        />
                    </View>
                </View>

                {/* DEV интерфейс — БЕЗ ВЛОЖЕННОГО ScrollView */}
                {isDev ? (
                    <View style={styles.devWrap}>
                        <Text style={styles.devTitle}>Панель разработчика</Text>

                        {adminError ? <Text style={styles.errorText}>{adminError}</Text> : null}

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Добавить мойку</Text>

                            <TextInput
                                value={cwName}
                                onChangeText={setCwName}
                                placeholder="Название"
                                placeholderTextColor={theme.colors.textMuted}
                                style={styles.input}
                            />
                            <View style={{ height: 10 }} />

                            <TextInput
                                value={cwAddress}
                                onChangeText={setCwAddress}
                                placeholder="Адрес"
                                placeholderTextColor={theme.colors.textMuted}
                                style={styles.input}
                            />
                            <View style={{ height: 10 }} />

                            <TextInput
                                value={cwLat}
                                onChangeText={setCwLat}
                                placeholder="Latitude"
                                placeholderTextColor={theme.colors.textMuted}
                                style={styles.input}
                                keyboardType="numeric"
                            />
                            <View style={{ height: 10 }} />

                            <TextInput
                                value={cwLng}
                                onChangeText={setCwLng}
                                placeholder="Longitude"
                                placeholderTextColor={theme.colors.textMuted}
                                style={styles.input}
                                keyboardType="numeric"
                            />


                            <View style={{ height: 12 }} />
                            <AppButton title="Создать мойку" onPress={handleCreateCarWash} />
                        </View>

                        <View style={styles.card}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.cardTitle}>Мойки</Text>
                                <View style={{ width: 140 }}>
                                    <AppButton title="Обновить" variant="secondary" onPress={loadCarWashes} />
                                </View>
                            </View>

                            {loadingWashes ? <Text style={styles.hint}>Загрузка моек…</Text> : null}

                            {carWashes.length === 0 && !loadingWashes ? (
                                <Text style={styles.hint}>Моек нет (или API недоступен).</Text>
                            ) : null}

                            <View style={{ height: 10 }} />

                            {carWashes.map((w) => {
                                const active = w.id === selectedWashId;
                                return (
                                    <Pressable
                                        key={String(w.id)}
                                        onPress={() => setSelectedWashId(w.id)}
                                        style={[styles.washItem, active && styles.washItemActive]}
                                    >
                                        <Text style={[styles.washName, active && styles.washNameActive]}>
                                            #{w.id} — {w.name}
                                        </Text>
                                        <Text style={styles.washAddr} numberOfLines={1}>
                                            {w.address}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Добавить бокс</Text>

                            <Text style={styles.metaSmall}>
                                Выбранная мойка: {selectedWashId ? `#${selectedWashId}` : "—"}
                            </Text>

                            <View style={{ height: 8 }} />

                            <TextInput
                                value={boxNumber}
                                onChangeText={setBoxNumber}
                                placeholder="Номер бокса (например 1)"
                                placeholderTextColor={theme.colors.textMuted}
                                style={styles.input}
                                keyboardType="numeric"
                            />

                            <View style={{ height: 10 }} />

                            <TextInput
                                value={boxDesc}
                                onChangeText={setBoxDesc}
                                placeholder="Описание (опционально)"
                                placeholderTextColor={theme.colors.textMuted}
                                style={styles.input}
                            />

                            <View style={{ height: 10 }} />

                            <View style={styles.row}>
                                <Pressable
                                    onPress={() => setBoxStatus("AVAILABLE")}
                                    style={[styles.chip, boxStatus === "AVAILABLE" && styles.chipActive]}
                                >
                                    <Text style={[styles.chipText, boxStatus === "AVAILABLE" && styles.chipTextActive]}>
                                        AVAILABLE
                                    </Text>
                                </Pressable>

                                <View style={{ width: 10 }} />

                                <Pressable
                                    onPress={() => setBoxStatus("BUSY")}
                                    style={[styles.chip, boxStatus === "BUSY" && styles.chipActive]}
                                >
                                    <Text style={[styles.chipText, boxStatus === "BUSY" && styles.chipTextActive]}>
                                        BUSY
                                    </Text>
                                </Pressable>
                            </View>

                            <View style={{ height: 12 }} />
                            <AppButton title="Создать бокс" onPress={handleCreateBox} />
                        </View>

                        <View style={styles.card}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.cardTitle}>Боксы мойки</Text>
                                <View style={{ width: 140 }}>
                                    <AppButton
                                        title="Обновить"
                                        variant="secondary"
                                        onPress={() => selectedWashId && loadBoxes(selectedWashId)}
                                    />
                                </View>
                            </View>

                            {loadingBoxes ? <Text style={styles.hint}>Загрузка боксов…</Text> : null}

                            {!loadingBoxes && boxes.length === 0 ? (
                                <Text style={styles.hint}>Боксов нет (или API недоступен).</Text>
                            ) : null}

                            <View style={{ height: 10 }} />

                            {boxes.map((b) => (
                                <View key={String(b.id)} style={styles.boxItem}>
                                    <Text style={styles.washName}>
                                        #{b.id} — Бокс {b.number}
                                    </Text>
                                    <Text style={styles.metaSmall}>status: {String(b.status)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ) : null}

                {/* footer теперь внутри скролла */}
                <View style={styles.footer}>
                    <AppButton title="Сохранить" onPress={() => router.back()} />
                    <AppButton
                        title="Выйти"
                        variant="secondary"
                        onPress={() => router.replace("/(auth)/login")}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.white },

    scroll: { flex: 1 },
    scrollContent: {
        paddingBottom: 28, // чтобы низ всегда был виден
    },

    backButton: { paddingHorizontal: 16, paddingVertical: 12 },
    backText: { fontSize: 16, fontWeight: "600", color: theme.colors.primary },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: theme.colors.text,
        textAlign: "center",
        marginVertical: 12,
    },

    centerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginBottom: 6,
    },
    hint: { color: theme.colors.textMuted, fontWeight: "600", textAlign: "center" },

    errorText: {
        marginHorizontal: 16,
        marginBottom: 10,
        color: "#B00020",
        fontWeight: "700",
    },

    form: { paddingHorizontal: 16, gap: 16, marginBottom: 14 },
    field: { gap: 6 },

    label: { fontSize: 14, color: theme.colors.text },

    input: {
        height: 52,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        color: theme.colors.text,
        backgroundColor: theme.colors.white,
    },

    footer: { padding: 16, gap: 12 },

    card: {
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 20,
        padding: 12,
        backgroundColor: theme.colors.white,
    },
    cardTitle: { fontSize: 16, fontWeight: "800", color: theme.colors.text, marginBottom: 10 },
    meta: { fontSize: 13, color: theme.colors.text, fontWeight: "600", marginBottom: 4 },
    metaSmall: { fontSize: 12, color: theme.colors.textMuted, fontWeight: "700" },

    devWrap: { paddingBottom: 8 },
    devTitle: {
        fontSize: 18,
        fontWeight: "900",
        color: theme.colors.text,
        marginHorizontal: 16,
        marginBottom: 10,
    },

    row: { flexDirection: "row", alignItems: "center" },
    rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    half: { flex: 1 },

    washItem: {
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.12)",
        borderRadius: 14,
        padding: 10,
        marginBottom: 8,
    },
    washItemActive: {
        borderColor: theme.colors.primary,
        backgroundColor: "rgba(43, 179, 192, 0.08)",
    },
    washName: { fontSize: 13, fontWeight: "800", color: theme.colors.text },
    washNameActive: { color: theme.colors.primary },
    washAddr: { marginTop: 4, fontSize: 12, color: theme.colors.textMuted, fontWeight: "600" },

    chip: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    chipActive: { backgroundColor: theme.colors.primary },
    chipText: { fontWeight: "800", color: theme.colors.primary, fontSize: 12 },
    chipTextActive: { color: theme.colors.white },

    boxItem: {
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.12)",
        borderRadius: 14,
        padding: 10,
        marginBottom: 8,
    },
});
