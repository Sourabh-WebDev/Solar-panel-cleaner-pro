import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { GOOGLE_MAPS_API_KEY } from "../../../shared/config";
import { decodePolyline, formatDistance, haversineDistance } from "../../../shared/utils/maps";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import { useTechnicianLocation } from "../context/TechnicianLocationContext";
import type { TechnicianRootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<TechnicianRootStackParamList, "Map">;

// Customer location — in a real app this would come from the job/backend
const CUSTOMER_LOCATION = { latitude: 28.6524, longitude: 77.3065 };

type RouteInfo = {
    polyline: { latitude: number; longitude: number }[];
    distanceText: string;
    durationText: string;
};

async function fetchRoute(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
): Promise<RouteInfo | null> {
    try {
        const url =
            `https://maps.googleapis.com/maps/api/directions/json` +
            `?origin=${origin.latitude},${origin.longitude}` +
            `&destination=${destination.latitude},${destination.longitude}` +
            `&mode=driving` +
            `&key=${GOOGLE_MAPS_API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.status !== "OK" || !data.routes?.length) return null;

        const leg = data.routes[0].legs[0];
        const encodedPolyline = data.routes[0].overview_polyline.points;

        return {
            polyline: decodePolyline(encodedPolyline),
            distanceText: leg.distance.text,
            durationText: leg.duration.text,
        };
    } catch {
        return null;
    }
}

export default function MapScreen({ navigation, route }: Props) {
    const { job } = route.params;
    const { currentLocation } = useTechnicianLocation();
    const mapRef = useRef<MapView>(null);

    const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
    const [loadingRoute, setLoadingRoute] = useState(false);

    const origin = currentLocation ?? { latitude: 28.6465, longitude: 77.3183 };

    // Fetch route whenever technician location updates (throttled via ref)
    const lastFetchRef = useRef<number>(0);
    useEffect(() => {
        const now = Date.now();
        if (now - lastFetchRef.current < 30_000 && routeInfo) return; // refetch every 30s
        lastFetchRef.current = now;

        setLoadingRoute(true);
        fetchRoute(origin, CUSTOMER_LOCATION).then((info) => {
            setRouteInfo(info);
            setLoadingRoute(false);
        });
    }, [currentLocation]);

    // Fit map to show both markers after route loads
    useEffect(() => {
        if (!routeInfo || !mapRef.current) return;
        mapRef.current.fitToCoordinates([origin, CUSTOMER_LOCATION], {
            edgePadding: { top: 80, right: 60, bottom: 260, left: 60 },
            animated: true,
        });
    }, [routeInfo]);

    const straightDistance = haversineDistance(origin, CUSTOMER_LOCATION);
    const distanceLabel = routeInfo?.distanceText ?? formatDistance(straightDistance);
    const etaLabel = routeInfo?.durationText ?? "Calculating...";

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: (origin.latitude + CUSTOMER_LOCATION.latitude) / 2,
                    longitude: (origin.longitude + CUSTOMER_LOCATION.longitude) / 2,
                    latitudeDelta: Math.abs(origin.latitude - CUSTOMER_LOCATION.latitude) * 2.5 + 0.01,
                    longitudeDelta: Math.abs(origin.longitude - CUSTOMER_LOCATION.longitude) * 2.5 + 0.01,
                }}
                showsUserLocation={false}
                showsMyLocationButton={false}
                showsTraffic
            >
                {/* Technician marker */}
                <Marker coordinate={origin} title="You" anchor={{ x: 0.5, y: 0.5 }}>
                    <View style={styles.techMarker}>
                        <Ionicons name="car" size={18} color="#fff" />
                    </View>
                </Marker>

                {/* Customer marker */}
                <Marker coordinate={CUSTOMER_LOCATION} title={job.customer}>
                    <View style={styles.customerMarker}>
                        <Ionicons name="home" size={16} color="#fff" />
                    </View>
                </Marker>

                {/* Route polyline */}
                {routeInfo && (
                    <Polyline
                        coordinates={routeInfo.polyline}
                        strokeColor={colors.primary}
                        strokeWidth={5}
                        lineDashPattern={undefined}
                    />
                )}

                {/* Fallback straight line while loading */}
                {!routeInfo && (
                    <Polyline
                        coordinates={[origin, CUSTOMER_LOCATION]}
                        strokeColor={colors.primary}
                        strokeWidth={3}
                        lineDashPattern={[8, 4]}
                    />
                )}
            </MapView>

            {/* Loading overlay */}
            {loadingRoute && (
                <View style={styles.loadingBadge}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.loadingText}>Getting route...</Text>
                </View>
            )}

            <View style={styles.bottomCard}>
                <Text style={styles.cardTitle}>Route to {job.customer}</Text>
                <Text style={styles.cardSubtitle}>{job.address}</Text>

                <View style={styles.metricRow}>
                    <View style={styles.metricCard}>
                        <Ionicons name="time-outline" size={16} color={colors.primary} />
                        <Text style={styles.metricLabel}>ETA</Text>
                        <Text style={styles.metricValue}>{etaLabel}</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Ionicons name="navigate-outline" size={16} color={colors.primary} />
                        <Text style={styles.metricLabel}>Distance</Text>
                        <Text style={styles.metricValue}>{distanceLabel}</Text>
                    </View>
                </View>

                <Pressable
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate("JobProgress", { job: { ...job, status: "In Progress" } })}
                >
                    <Text style={styles.primaryText}>Mark Arrived & Start Work</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    map: {
        flex: 1,
    },
    techMarker: {
        backgroundColor: colors.primary,
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#fff",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    customerMarker: {
        backgroundColor: "#FF5252",
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#fff",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    loadingBadge: {
        position: "absolute",
        top: spacing.md,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    loadingText: {
        color: colors.textSecondary,
        fontSize: 13,
    },
    bottomCard: {
        position: "absolute",
        left: spacing.md,
        right: spacing.md,
        bottom: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.sm,
        ...shadow,
    },
    cardTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "800",
    },
    cardSubtitle: {
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    metricRow: {
        flexDirection: "row",
        gap: spacing.sm,
    },
    metricCard: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: radius.md,
        padding: spacing.md,
        alignItems: "center",
        gap: 2,
    },
    metricLabel: {
        color: colors.textSecondary,
        fontSize: 11,
    },
    metricValue: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "800",
    },
    primaryButton: {
        marginTop: spacing.xs,
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        paddingVertical: 14,
        alignItems: "center",
    },
    primaryText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "700",
    },
});
