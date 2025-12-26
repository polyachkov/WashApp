import { useEffect, useMemo, useRef, useState } from "react";
import {View, Text, StyleSheet, Pressable} from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/shared/theme/theme";
import { AppButton } from "@/shared/ui/AppButton";
import { CarWashesService, CarWash } from "@/features/main/carWashes/services/CarWashesService";
import { selectedCarWashStorage } from "@/shared/storage/selectedCarWash";
import {control} from "leaflet";

export default function SelectWashOnMapScreen() {
    const router = useRouter();

    const mapRef = useRef<any>(null);
    const leafletRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const mapDivId = useMemo(() => `leaflet-map-${Math.random().toString(16).slice(2)}`, []);

    const [items, setItems] = useState<CarWash[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        (async () => {
            const page = await CarWashesService.list();
            setItems(page.content);
        })();
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

            const map = L.map(el, { zoomControl: false }).setView([center.lat, center.lng], 12);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(map);
            map.attributionControl.setPrefix("");

            mapRef.current = map;
            setMapReady(true);
        })();

        return () => {
            cancelled = true;
            // cleanup: удалить карту при размонтировании
            try {
                mapRef.current?.remove();
            } catch {}
            mapRef.current = null;
            markersRef.current = [];
        };
    }, [mapDivId]); // центр отдельно обработаем ниже

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
            try { m.remove(); } catch {}
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

            marker.on("click", () => setSelectedId(w.id));

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
            <Pressable onPress={() => router.replace("/(main)/wash")} style={styles.backButton}>
                <Text style={styles.backText}>← Назад</Text>
            </Pressable>

            <Text style={styles.title}>Выберите мойку на карте</Text>

            {/* минимальный CSS для leaflet контейнера (без leaflet.css) */}
            <style>{`
                .leaflet-container { width: 100%; height: 100%; }
                .leaflet-pane, .leaflet-tile, .leaflet-marker-icon, .leaflet-marker-shadow,
                .leaflet-tile-container, .leaflet-map-pane svg, .leaflet-map-pane canvas,
                .leaflet-zoom-box, .leaflet-image-layer, .leaflet-layer { position: absolute; left: 0; top: 0; }
                .leaflet-control-container { position: absolute; z-index: 1000; }
                .leaflet-control-zoom { background: white; border-radius: 8px; overflow: hidden; border: 1px solid rgba(0,0,0,.2); }
                .leaflet-control-zoom a { display:block; width: 34px; height: 34px; line-height: 34px; text-align:center; text-decoration:none; color:#000; }
                .leaflet-popup { position: absolute; text-align: center; margin-bottom: 20px; }
                .leaflet-popup-content-wrapper { background: white; border-radius: 12px; padding: 8px 10px; border: 1px solid rgba(0,0,0,.15); }
            `}</style>

            <View style={styles.mapCard}>
                {/* div-контейнер для leaflet */}
                <div id={mapDivId} style={{ width: "100%", height: "100%" }} />
            </View>

            <View style={styles.actions}>
                <AppButton title="Выбрать" onPress={handlePick} disabled={!selectedId} />
                <View style={{ height: 12 }} />
                <AppButton title="Назад" onPress={() => router.back()} />
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

    title: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        color: theme.colors.text,
        marginTop: 8,             // расстояние от back
        marginBottom: 12,         // расстояние до карты
    },

    mapCard: {
        marginHorizontal: 16,
        marginTop: 0,             // можно 0, т.к. title уже дал marginBottom
        marginBottom: 12,
        height: 420,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: theme.colors.white,
    },

    address: {
        margin: 16,
        padding: 12,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 20,
    },
    addressText: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.colors.text,
    },
    actions: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },

    backButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 0,
    },

    backText: {
        fontSize: 16,
        fontWeight: "600",
        color: theme.colors.primary,
    },
});
