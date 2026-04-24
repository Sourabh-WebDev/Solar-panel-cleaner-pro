import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import { useCustomerBooking } from "../context/CustomerBookingContext";

const flowLabels = [
    { key: "select-service", label: "Select Service" },
    { key: "select-address", label: "Select Address" },
    { key: "select-slot", label: "Select Date & Slot" },
    { key: "confirm-booking", label: "Confirm Booking" },
    { key: "searching-technician", label: "Searching Technician" },
    { key: "technician-assigned", label: "Technician Assigned" },
    { key: "live-tracking", label: "Live Tracking on Map" },
    { key: "service-completed", label: "Service Completed" },
    { key: "rating-feedback", label: "Rating & Feedback" },
] as const;

export default function BookingScreen() {
    const navigation = useNavigation<any>();
    const { booking, resetBooking } = useCustomerBooking();

    const activeIndex = flowLabels.findIndex((item) => item.key === booking.stage);
    const hasActiveBooking = Boolean(booking.service);

    const handlePrimary = () => {
        if (!hasActiveBooking) {
            navigation.navigate("ServicesList");
            return;
        }

        const routeMap: Record<string, string> = {
            "select-address": "Address",
            "select-slot": "DateSlot",
            "confirm-booking": "ConfirmBooking",
            "searching-technician": "SearchingTechnician",
            "technician-assigned": "TechnicianAssigned",
            "live-tracking": "LiveTracking",
            "service-completed": "ServiceCompleted",
            "rating-feedback": "RatingFeedback",
        };

        navigation.navigate(routeMap[booking.stage] ?? "ServicesList");
    };

    const handleNewBooking = () => {
        resetBooking();
        navigation.navigate("ServicesList");
    };

    return (
        <LinearGradient colors={["#F4F7FB", "#E8EEF7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientContainer}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.decorativeBlob1} />
                <View style={styles.decorativeBlob2} />
                <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                    <Text style={styles.title}>Your Booking Flow</Text>
                    <Text style={styles.subtitle}>
                        Track each step from service selection to rating and feedback.
                    </Text>

                    {hasActiveBooking ? (
                        <>
                            <View style={styles.summaryCard}>
                                <Text style={styles.summaryLabel}>Current Booking</Text>
                                <Text style={styles.summaryTitle}>{booking.service?.name}</Text>
                                <Text style={styles.summaryText}>{booking.address || "Address pending"}</Text>
                                <Text style={styles.summaryText}>
                                    {booking.date || "Date pending"} {booking.slot ? `| ${booking.slot}` : ""}
                                </Text>
                            </View>

                            <View style={styles.timelineCard}>
                                {flowLabels.map((item, index) => {
                                    const active = index <= activeIndex;

                                    return (
                                        <View key={item.key} style={styles.timelineRow}>
                                            <View style={[styles.dot, active && styles.dotActive]} />
                                            <Text style={[styles.timelineText, active && styles.timelineTextActive]}>
                                                {item.label}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>

                            <Pressable style={styles.primaryButton} onPress={handlePrimary}>
                                <Text style={styles.primaryButtonText}>Open Current Step</Text>
                            </Pressable>

                            <Pressable style={styles.secondaryButton} onPress={handleNewBooking}>
                                <Text style={styles.secondaryButtonText}>Start New Booking</Text>
                            </Pressable>
                        </>
                    ) : (
                        <>
                            <View style={styles.summaryCard}>
                                <Text style={styles.summaryTitle}>No active booking</Text>
                                <Text style={styles.summaryText}>
                                    Start from services, choose address, select slot and confirm your booking.
                                </Text>
                            </View>

                            <Pressable style={styles.primaryButton} onPress={handlePrimary}>
                                <Text style={styles.primaryButtonText}>Book a Service</Text>
                            </Pressable>
                        </>
                    )}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        position: "relative",
        overflow: "hidden",
    },
    decorativeBlob1: {
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "#0B6DFF",
        opacity: 0.08,
        top: -50,
        right: -50,
    },
    decorativeBlob2: {
        position: "absolute",
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: "#1F9D57",
        opacity: 0.06,
        bottom: 100,
        left: -30,
    },
    container: {
        flex: 1,
        zIndex: 1,
    },

    content: {
        padding: spacing.lg,
        paddingBottom: spacing.xl * 2,
    },
    title: {
        color: colors.textPrimary,
        fontSize: typography.h2,
        fontWeight: "800",
    },
    subtitle: {
        marginTop: spacing.xs,
        marginBottom: spacing.lg,
        color: colors.textSecondary,
        fontSize: typography.body,
    },
    summaryCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...shadow,
    },
    summaryLabel: {
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    summaryTitle: {
        marginTop: 4,
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "800",
    },
    summaryText: {
        marginTop: spacing.sm,
        color: colors.textSecondary,
        fontSize: typography.body,
        lineHeight: 22,
    },
    timelineCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.lg,
        ...shadow,
    },
    timelineRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.border,
    },
    dotActive: {
        backgroundColor: colors.primary,
    },
    timelineText: {
        color: colors.textSecondary,
        fontSize: typography.body,
        fontWeight: "600",
    },
    timelineTextActive: {
        color: colors.textPrimary,
        fontWeight: "800",
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
    secondaryButton: {
        marginTop: spacing.sm,
        minHeight: 54,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
    },
    secondaryButtonText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "800",
    },
});
