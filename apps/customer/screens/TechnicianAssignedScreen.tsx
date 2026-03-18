import { useNavigation } from "@react-navigation/native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useCustomerBooking } from "../context/CustomerBookingContext";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";

export default function TechnicianAssignedScreen() {
    const navigation = useNavigation<any>();
    const { booking, setStage } = useCustomerBooking();

    const handleTrack = () => {
        setStage("live-tracking");
        navigation.navigate("LiveTracking");
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>Technician Assigned</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.name}>{booking.technicianName}</Text>
                <Text style={styles.detail}>Phone: {booking.technicianPhone}</Text>
                <Text style={styles.detail}>ETA: {booking.eta}</Text>
                <Text style={styles.detail}>Service: {booking.service?.name}</Text>
                <Text style={styles.detail}>Address: {booking.address}</Text>
            </View>

            <Pressable style={styles.primaryButton} onPress={handleTrack}>
                <Text style={styles.primaryButtonText}>Open Live Tracking</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
    badge: {
        alignSelf: "flex-start",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.pill,
        backgroundColor: "#EAF8F0",
        marginBottom: spacing.md,
    },
    badgeText: {
        color: colors.success,
        fontSize: typography.caption,
        fontWeight: "800",
    },
    card: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.lg,
        ...shadow,
    },
    name: {
        color: colors.textPrimary,
        fontSize: typography.h2,
        fontWeight: "800",
        marginBottom: spacing.sm,
    },
    detail: {
        color: colors.textSecondary,
        fontSize: typography.body,
        marginBottom: 8,
        lineHeight: 22,
    },
    primaryButton: {
        marginTop: spacing.lg,
        minHeight: 54,
        borderRadius: radius.pill,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        ...shadow,
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "800",
    },
});
