import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { GOOGLE_MAPS_API_KEY } from "../../../shared/config";
import { decodePolyline, formatDistance, haversineDistance } from "../../../shared/utils/maps";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import { useCustomerBooking } from "../context/CustomerBookingContext";

// Simulated technician starting point (about 3 km away from customer)
const TECHNICIAN_START = { latitude: 28.6289, longitude: 77.3646 };
// Customer location (destination)
const CUSTOMER_LOCATION = { latitude: 28.6524, longitude: 77.3065 };

type Coord = { latitude: number; longitude: number };

async function fetchRoute(origin: Coord, destination: Coord): Promise<Coord[]> {
    try {
        const url =
            `https://maps.googleapis.com/maps/api/directions/json` +
            `?origin=${origin.latitude},${origin.longitude}` +
            `&destination=${destination.latitude},${destination.longitude}` +
            `&mode=driving` +
            `&key=${GOOGLE_MAPS_API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.status !== "OK" || !data.routes?.length) return [];
        return decodePolyline(data.routes[0].overview_polyline.points);
    } catch {
        return [];
    }
}

function interpolate(a: Coord, b: Coord, t: number): Coord {
    return {
        latitude: a.latitude + (b.latitude - a.latitude) * t,
        longitude: a.longitude + (b.longitude - a.longitude) * t,
    };
}

export default function LiveTrackingScreen() {
    const navigation = useNavigation<any>();
    const { booking, setStage } = useCustomerBooking();
    const mapRef = useRef<MapView>(null);

    const [routePoints, setRoutePoints] = useState<Coord[]>([]);
    const [loadingRoute, setLoadingRoute] = useState(true);

    // Progress along the route (0 = start, routePoints.length - 1 = destination)
    const [pointIndex, setPointIndex] = useState(0);
    const animatedIndex = useRef(new Animated.Value(0)).current;

    // Interpolated technician position
    const [technicianCoord, setTechnicianCoord] = useState<Coord>(TECHNICIAN_START);

    // Fetch real route on mount
    useEffect(() => {
        fetchRoute(TECHNICIAN_START, CUSTOMER_LOCATION).then((pts) => {
            const points = pts.length > 0 ? pts : buildFallbackRoute();
            setRoutePoints(points);
            setLoadingRoute(false);
        });
    }, []);

    // Animate technician along the route
    useEffect(() => {
        if (routePoints.length < 2) return;

        const totalPoints = routePoints.length;
        let step = 0;

        const interval = setInterval(() => {
            step += 1;
            if (step >= totalPoints - 1) {
                clearInterval(interval);
                setTechnicianCoord(CUSTOMER_LOCATION);
                setPointIndex(totalPoints - 1);
                return;
            }
            setPointIndex(step);
            setTechnicianCoord(routePoints[step]);

            // Auto-pan map to keep technician in view
            mapRef.current?.animateToRegion(
                {
                    latitude: routePoints[step].latitude,
                    longitude: routePoints[step].longitude,
                    latitudeDelta: 0.012,
                    longitudeDelta: 0.012,
                },
                600
            );
        }, 2500);

        return () => clearInterval(interval);
    }, [routePoints]);

    const distanceKm = haversineDistance(technicianCoord, CUSTOMER_LOCATION);
    const distanceLabel = formatDistance(distanceKm);
    const etaMinutes = Math.max(1, Math.round(distanceKm * 3)); // rough 20 km/h urban
    const etaLabel = etaMinutes <= 1 ? "Arriving now" : `${etaMinutes} min`;

    const remainingRoute = useMemo(
        () => (routePoints.length ? routePoints.slice(pointIndex) : []),
        [routePoints, pointIndex]
    );

    const initialRegion = useMemo(
        () => ({
            latitude: (TECHNICIAN_START.latitude + CUSTOMER_LOCATION.latitude) / 2,
            longitude: (TECHNICIAN_START.longitude + CUSTOMER_LOCATION.longitude) / 2,
            latitudeDelta: Math.abs(TECHNICIAN_START.latitude - CUSTOMER_LOCATION.latitude) * 2.5 + 0.01,
            longitudeDelta: Math.abs(TECHNICIAN_START.longitude - CUSTOMER_LOCATION.longitude) * 2.5 + 0.01,
        }),
        []
    );

    const handleComplete = () => {
        setStage("service-completed");
        navigation.navigate("ServiceCompleted");
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
                showsTraffic
                showsMyLocationButton={false}
            >
                {/* Travelled route (greyed out) */}
                {pointIndex > 0 && routePoints.length > 0 && (
                    <Polyline
                        coordinates={routePoints.slice(0, pointIndex + 1)}
                        strokeColor="#BDBDBD"
                        strokeWidth={4}
                    />
                )}

                {/* Remaining route (coloured) */}
                {remainingRoute.length > 1 && (
                    <Polyline
                        coordinates={remainingRoute}
                        strokeColor={colors.primary}
                        strokeWidth={5}
                    />
                )}

                {/* Technician marker */}
                <Marker coordinate={technicianCoord} anchor={{ x: 0.5, y: 0.5 }}>
                    <View style={styles.techMarker}>
                        <Ionicons name="car" size={18} color="#fff" />
                    </View>
                </Marker>

                {/* Customer / destination marker */}
                <Marker coordinate={CUSTOMER_LOCATION} anchor={{ x: 0.5, y: 1 }}>
                    <View style={styles.homeMarker}>
                        <Ionicons name="home" size={16} color="#fff" />
                    </View>
                </Marker>
            </MapView>

            {/* Distance badge (Google Maps-style floating chip) */}
            <View style={styles.distanceBadge}>
                {loadingRoute ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                    <>
                        <Ionicons name="navigate" size={14} color={colors.primary} />
                        <Text style={styles.distanceText}>
                            {distanceLabel} away · {etaLabel}
                        </Text>
                    </>
                )}
            </View>

            <View style={styles.bottomSheet}>
                <View style={styles.handle} />

                <View style={styles.headerRow}>
                    <View style={styles.pulsDot} />
                    <Text style={styles.title}>Technician is on the way</Text>
                </View>
                <Text style={styles.subtitle}>
                    {booking.service?.name} · {booking.technicianName}
                </Text>

                <View style={styles.statusRow}>
                    <View style={styles.statusChip}>
                        <Ionicons name="time-outline" size={18} color={colors.primary} />
                        <Text style={styles.statusLabel}>ETA</Text>
                        <Text style={styles.statusValue}>{etaLabel}</Text>
                    </View>
                    <View style={styles.statusChip}>
                        <Ionicons name="navigate-outline" size={18} color={colors.primary} />
                        <Text style={styles.statusLabel}>Distance</Text>
                        <Text style={styles.statusValue}>{distanceLabel}</Text>
                    </View>
                    <View style={styles.statusChip}>
                        <Ionicons name="person-outline" size={18} color={colors.primary} />
                        <Text style={styles.statusLabel}>Technician</Text>
                        <Text style={styles.statusValue} numberOfLines={1}>
                            {booking.technicianName}
                        </Text>
                    </View>
                </View>

                <View style={styles.addressCard}>
                    <Ionicons name="location" size={16} color="#FF5252" />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.addressLabel}>Your location</Text>
                        <Text style={styles.addressText}>{booking.address}</Text>
                    </View>
                </View>

                <Pressable style={styles.primaryButton} onPress={handleComplete}>
                    <Text style={styles.primaryButtonText}>Mark Service Completed</Text>
                </Pressable>
            </View>
        </View>
    );
}

/** Fallback straight-line interpolated waypoints if Directions API fails */
function buildFallbackRoute(): Coord[] {
    const steps = 20;
    return Array.from({ length: steps + 1 }, (_, i) =>
        interpolate(TECHNICIAN_START, CUSTOMER_LOCATION, i / steps)
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
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#fff",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    homeMarker: {
        backgroundColor: "#FF5252",
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#fff",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    distanceBadge: {
        position: "absolute",
        top: spacing.lg,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 9,
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
    },
    distanceText: {
        color: colors.textPrimary,
        fontSize: 13,
        fontWeight: "700",
    },
    bottomSheet: {
        position: "absolute",
        left: spacing.md,
        right: spacing.md,
        bottom: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: spacing.lg,
        ...shadow,
    },
    handle: {
        alignSelf: "center",
        width: 52,
        height: 5,
        borderRadius: radius.pill,
        backgroundColor: colors.border,
        marginBottom: spacing.md,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    pulsDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#4CAF50",
    },
    title: {
        color: colors.textPrimary,
        fontSize: typography.h2,
        fontWeight: "800",
    },
    subtitle: {
        marginTop: spacing.xs,
        color: colors.textSecondary,
        fontSize: typography.body,
    },
    statusRow: {
        flexDirection: "row",
        gap: spacing.sm,
        marginTop: spacing.lg,
    },
    statusChip: {
        flex: 1,
        backgroundColor: "#F4F8FD",
        borderRadius: radius.md,
        padding: spacing.sm,
        alignItems: "center",
        gap: 3,
    },
    statusLabel: {
        color: colors.textSecondary,
        fontSize: 11,
        fontWeight: "700",
    },
    statusValue: {
        color: colors.textPrimary,
        fontSize: 12,
        fontWeight: "800",
        textAlign: "center",
    },
    addressCard: {
        marginTop: spacing.md,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        backgroundColor: "#F8FAFC",
        borderRadius: radius.md,
        padding: spacing.md,
    },
    addressLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: "700",
    },
    addressText: {
        marginTop: 2,
        color: colors.textPrimary,
        fontSize: typography.body,
        lineHeight: 22,
    },
    primaryButton: {
        marginTop: spacing.lg,
        minHeight: 54,
        borderRadius: radius.pill,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "800",
    },
});
