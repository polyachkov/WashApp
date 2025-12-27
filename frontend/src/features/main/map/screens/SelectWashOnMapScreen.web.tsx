import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/shared/theme/theme";
import { AppButton } from "@/shared/ui/AppButton";
import { CarWashesService, CarWash } from "@/features/main/carWashes/services/CarWashesService";
import { selectedCarWashStorage } from "@/shared/storage/selectedCarWash";

const MOCK_WASHES: CarWash[] = [
    {
        id: 1,
        name: "Мойка №1",
        address: "Новосибирск, Иванова 1, 1",
        latitude: 55.012345,
        longitude: 82.987654,
        created_at: "",
    },
    {
        id: 2,
        name: "Мойка №2",
        address: "Новосибирск, Ленина 10",
        latitude: 55.0301,
        longitude: 82.9202,
        created_at: "",
    },
];

export default function SelectWashOnMapScreen() {
    const router = useRouter();

    const mapRef = useRef<any>(null);
    const leafletRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const mapDivId = useMemo(
        () => `leaflet-map-${Math.random().toString(16).slice(2)}`,
        []
    );

    const [items, setItems] = useState<CarWash[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [mapReady, setMapReady] = useState(false);

    const [loading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState<string | null>(null);

    // 0) Загрузка моек (без падения экрана)
    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setErrorText(null);

            try {
                const page = await CarWashesService.list(); // если у тебя list({page,size}) — подставь тут
                if (cancelled) return;

                const content = (page as any)?.content ?? [];
                setItems(content);
            } catch (e: any) {
                if (cancelled) return;

                setErrorText(
                    e?.response?.status ? `Ошибка API: ${e.response.status}` : "Ошибка API"
                );
                setItems(MOCK_WASHES); // ✅ заглушка вместо падения
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const selected = useMemo(
        () => items.find((x) => x.id === selectedId) ?? null,
        [items, selectedId]
    );

    const center = useMemo(() => {
        const first = items[0];
        return {
            lat: first?.latitude ?? 55.012345,
            lng: first?.longitude ?? 82.987654,
        };
    }, [items]);

    // 1) Подгружаем leaflet ТОЛЬКО в браузере и создаём карту
    useEffect(() => {
        let cancelled = false;

        (async () => {
            if (typeof window === "undefined") return;

            // динамический импорт, чтобы не было SSR-crash
            const L = (await import("leaflet")).default;
            if (cancelled) return;

            leafletRef.current = L;

            // создать карту 1 раз
            const el = document.getElementById(mapDivId);
            if (!el || mapRef.current) return;

            const map = L.map(el, { zoomControl: false }).setView(
                [center.lat, center.lng],
                12
            );

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(map);

            // убрать "Leaflet"
            map.attributionControl.setPrefix("");

            mapRef.current = map;
            setMapReady(true);
        })();

        return () => {
            cancelled = true;
            try {
                mapRef.current?.remove();
            } catch {}
            mapRef.current = null;
            markersRef.current = [];
        };
    }, [mapDivId]);

    // 2) Если центр изменился (когда загрузили items) — центрируем карту
    useEffect(() => {
        if (!mapReady || !mapRef.current) return;
        mapRef.current.setView([center.lat, center.lng], 12);
    }, [mapReady, center.lat, center.lng]);

    // 3) Рисуем маркеры (и перерисовываем если items изменились)
    useEffect(() => {
        const L = leafletRef.current;
        const map = mapRef.current;
        if (!L || !map) return;

        // удалить старые
        markersRef.current.forEach((m) => {
            try {
                m.remove();
            } catch {}
        });
        markersRef.current = [];

        // добавить новые
        items.forEach((w) => {
            const marker = L.circleMarker([w.latitude, w.longitude], {
                radius: 10,
                color: theme.colors.primary,
                weight: 2,
                fillColor: theme.colors.primary,
                fillOpacity: 0.9,
            }).addTo(map);

            const onPick = () => {
                setSelectedId(w.id);
                try { marker.openPopup(); } catch {}
            };

            marker.on("click", onPick);
            marker.on("tap", onPick);

            marker.bindPopup(
                `<div style="max-width:220px">
          <b>${escapeHtml(w.name)}</b><br/>
          <span>${escapeHtml(w.address)}</span>
        </div>`
            );

            markersRef.current.push(marker);
        });
    }, [items]);

    const handlePick = async () => {
        if (!selectedId) return;
        await selectedCarWashStorage.set(selectedId);
        router.back();
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => router.replace("/(main)/wash")}
                style={styles.backButton}
            >
                <Text style={styles.backText}>← Назад</Text>
            </Pressable>

            <Text style={styles.title}>Выберите мойку на карте</Text>

            {loading ? (
                <Text style={styles.hintText}>Загрузка…</Text>
            ) : null}

            {errorText ? (
                <Text style={styles.errorText}>
                    {errorText}. Показаны мок-данные.
                </Text>
            ) : null}

            {/* минимальный CSS для leaflet контейнера (без leaflet.css) */}
            <style>{`
              .leaflet-container {
                width: 100%;
                height: 100%;
                touch-action: none;
                -webkit-tap-highlight-color: transparent;
              }
            
              .leaflet-pane, .leaflet-tile, .leaflet-tile-container,
              .leaflet-map-pane svg, .leaflet-map-pane canvas,
              .leaflet-zoom-box, .leaflet-image-layer, .leaflet-layer {
                position: absolute; left: 0; top: 0;
              }
            
              .leaflet-tile-pane { z-index: 200; }
              .leaflet-overlay-pane { z-index: 400; }
              .leaflet-shadow-pane { z-index: 500; }
              .leaflet-marker-pane { z-index: 600; }
              .leaflet-tooltip-pane { z-index: 650; }
              .leaflet-popup-pane { z-index: 700; }
            
              /* КЛЮЧЕВОЕ: чтобы SVG circleMarker был кликабельный */
              .leaflet-overlay-pane svg { pointer-events: none; }
              .leaflet-overlay-pane svg .leaflet-interactive { pointer-events: auto; cursor: pointer; }
            
              .leaflet-control-container { position: absolute; z-index: 1000; }
              .leaflet-control-zoom { display:none; }
              .leaflet-popup { position: absolute; text-align: center; margin-bottom: 20px; }
              .leaflet-popup-content-wrapper { background: white; border-radius: 12px; padding: 8px 10px; border: 1px solid rgba(0,0,0,.15); }
              .leaflet-control-attribution { font-size: 11px; }
            `}</style>


            <View style={styles.mapCard}>
                <div id={mapDivId} style={{width: "100%", height: "100%"}}/>
            </View>

            <View style={styles.address}>
                <Text style={styles.addressText} numberOfLines={2}>
                    {selected ? `Адрес: ${selected.address}` : "Нажмите на маркер мойки"}
                </Text>
            </View>

            <View style={styles.actions}>
                <AppButton title="Выбрать" onPress={handlePick} disabled={!selectedId}/>
                <View style={{height: 12}}/>
                <AppButton title="Назад" onPress={() => router.back()}/>
            </View>
        </View>
    );
}

function escapeHtml(s: string) {
    return s
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },

    backButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    backText: {
        fontSize: 16,
        fontWeight: "600",
        color: theme.colors.primary,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        color: theme.colors.text,
        marginTop: 8,
        marginBottom: 10,
    },

    hintText: {
        marginHorizontal: 16,
        marginBottom: 6,
        color: theme.colors.textMuted,
        fontWeight: "600",
        textAlign: "center",
    },

    errorText: {
        marginHorizontal: 16,
        marginBottom: 8,
        color: "#B00020",
        fontWeight: "600",
        textAlign: "center",
    },

    mapCard: {
        marginHorizontal: 16,
        marginBottom: 12,
        height: 360, // ✅ карта поменьше, чтобы кнопки точно влезали
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: theme.colors.white,
    },

    address: {
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 12,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 20,
    },

    addressText: {
        fontSize: 12,
        fontWeight: "700",
        color: theme.colors.textMuted,
    },

    actions: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        marginTop: "auto",
    },
});
