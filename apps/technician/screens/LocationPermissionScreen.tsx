import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import { useTechnicianLocation } from "../context/TechnicianLocationContext";
import type { TechnicianRootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<TechnicianRootStackParamList, "LocationPermission">;

export default function LocationPermissionScreen({ navigation }: Props) {
    const {
        permissionState,
        currentLocation,
        isTracking,
        isStartingTracking,
        isUsingCachedLocation,
        lastUpdatedAt,
        permissionMessage,
        trackingError,
        requestPermissionAndStartTracking,
        retryTracking,
    } = useTechnicianLocation();

    const handleStart = async () => {
        const started = await requestPermissionAndStartTracking();

        if (started) {
            navigation.replace("MainTabs");
        }
    };

    const handleRetry = async () => {
        const started = await retryTracking();

        if (started) {
            navigation.replace("MainTabs");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.eyebrow}>Location tracking start</Text>
                <Text style={styles.title}>Allow location and start sending technician GPS</Text>
                <Text style={styles.subtitle}>
                    {"App open -> Location permission -> Start sending GPS"}
                </Text>

                <View style={styles.statusCard}>
                    <Text style={styles.statusLabel}>Permission</Text>
                    <Text style={styles.statusValue}>
                        {permissionState === "granted"
                            ? "Granted"
                            : permissionState === "denied"
                              ? "Denied"
                              : "Pending"}
                    </Text>

                    <Text style={styles.statusLabel}>Tracking</Text>
                    <Text style={styles.statusValue}>{isTracking ? "Sending live GPS" : "Not started"}</Text>

                    <Text style={styles.statusLabel}>Location cache</Text>
                    <Text style={styles.statusValue}>
                        {isUsingCachedLocation ? "Using cached location" : "Live location active"}
                    </Text>

                    {currentLocation ? (
                        <>
                            <Text style={styles.statusLabel}>Current coordinates</Text>
                            <Text style={styles.statusValue}>
                                {currentLocation.latitude.toFixed(5)}, {currentLocation.longitude.toFixed(5)}
                            </Text>
                            {lastUpdatedAt ? (
                                <>
                                    <Text style={styles.statusLabel}>Last updated</Text>
                                    <Text style={styles.statusValue}>{lastUpdatedAt}</Text>
                                </>
                            ) : null}
                        </>
                    ) : null}
                </View>

                {permissionMessage ? <Text style={styles.message}>{permissionMessage}</Text> : null}
                {trackingError ? <Text style={styles.warning}>{trackingError}</Text> : null}

                <Pressable style={styles.button} onPress={handleStart} disabled={isStartingTracking}>
                    <Text style={styles.buttonText}>
                        {isStartingTracking ? "Starting GPS..." : "Allow location and start"}
                    </Text>
                </Pressable>

                <Pressable style={styles.retryButton} onPress={handleRetry} disabled={isStartingTracking}>
                    <Text style={styles.retryText}>
                        {isStartingTracking ? "Retrying..." : "Retry system"}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.lg,
        justifyContent: "center",
        backgroundColor: colors.background,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        gap: spacing.md,
        ...shadow,
    },
    eyebrow: {
        color: colors.primary,
        fontSize: typography.caption,
        fontWeight: "700",
        textTransform: "uppercase",
    },
    title: {
        color: colors.textPrimary,
        fontSize: 28,
        fontWeight: "900",
        lineHeight: 34,
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: typography.body,
        lineHeight: 22,
    },
    statusCard: {
        backgroundColor: colors.background,
        borderRadius: radius.md,
        padding: spacing.md,
        gap: 4,
    },
    statusLabel: {
        marginTop: spacing.xs,
        color: colors.textSecondary,
        fontSize: 12,
    },
    statusValue: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "700",
    },
    message: {
        color: "#B54708",
        fontSize: typography.caption,
        lineHeight: 18,
    },
    warning: {
        color: "#B42318",
        fontSize: typography.caption,
        lineHeight: 18,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        alignItems: "center",
        paddingVertical: 15,
    },
    retryButton: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        alignItems: "center",
        paddingVertical: 15,
    },
    buttonText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "700",
    },
    retryText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "700",
    },
});
