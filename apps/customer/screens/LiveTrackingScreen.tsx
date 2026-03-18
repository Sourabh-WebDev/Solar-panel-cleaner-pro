import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

import { useCustomerBooking } from "../context/CustomerBookingContext";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";

const routePoints = [
    { latitude: 28.6289, longitude: 77.3646 },
    { latitude: 28.6298, longitude: 77.3661 },
    { latitude: 28.6314, longitude: 77.3684 },
    { latitude: 28.6331, longitude: 77.3708 },
    { latitude: 28.6348, longitude: 77.3732 },
];

export default function LiveTrackingScreen() {
    const navigation = useNavigation<any>();
    const { booking, setStage } = useCustomerBooking();
    const [currentPointIndex, setCurrentPointIndex] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPointIndex((current) =>
                current < routePoints.length - 1 ? current + 1 : current
            );
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    const technicianCoordinate = routePoints[currentPointIndex];
    const customerCoordinate = routePoints[routePoints.length - 1];

    const region = useMemo(
        () => ({
            latitude: 28.6328,
            longitude: 77.3692,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
        }),
        []
    );

    const handleComplete = () => {
        setStage("service-completed");
        navigation.navigate("ServiceCompleted");
    };

    return (
        <View style={styles.container}>
            <MapView style={styles.map} initialRegion={region}>
                <Polyline
                    coordinates={routePoints}
                    strokeColor={colors.primary}
                    strokeWidth={5}
                />

                <Marker coordinate={customerCoordinate} title="Customer Location">
                    <View style={styles.customerPin}>
                        <Text style={styles.pinText}>Home</Text>
                    </View>
                </Marker>

                <Marker coordinate={technicianCoordinate} title={booking.technicianName}>
                    <View style={styles.technicianPin}>
                        <Text style={styles.pinText}>Tech</Text>
                    </View>
                </Marker>
            </MapView>

            <View style={styles.bottomSheet}>
                <View style={styles.handle} />

                <Text style={styles.title}>Technician is on the way</Text>
                <Text style={styles.subtitle}>
                    Live tracking for {booking.service?.name}
                </Text>

                <View style={styles.statusRow}>
                    <View style={styles.statusChip}>
                        <Text style={styles.statusLabel}>ETA</Text>
                        <Text style={styles.statusValue}>{booking.eta}</Text>
                    </View>

                    <View style={styles.statusChip}>
                        <Text style={styles.statusLabel}>Technician</Text>
                        <Text style={styles.statusValue}>{booking.technicianName}</Text>
                    </View>
                </View>

                <View style={styles.addressCard}>
                    <Text style={styles.addressLabel}>Destination</Text>
                    <Text style={styles.addressText}>{booking.address}</Text>
                </View>

                <Pressable style={styles.primaryButton} onPress={handleComplete}>
                    <Text style={styles.primaryButtonText}>Mark Service Completed</Text>
                </Pressable>
            </View>
        </View>
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
    customerPin: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.pill,
        backgroundColor: colors.primary,
        ...shadow,
    },
    technicianPin: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.pill,
        backgroundColor: colors.success,
        ...shadow,
    },
    pinText: {
        color: "#fff",
        fontSize: typography.caption,
        fontWeight: "800",
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
        padding: spacing.md,
    },
    statusLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: "700",
    },
    statusValue: {
        marginTop: 6,
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "800",
    },
    addressCard: {
        marginTop: spacing.md,
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
        marginTop: 6,
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
