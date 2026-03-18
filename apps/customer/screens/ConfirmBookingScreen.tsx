import { useNavigation } from "@react-navigation/native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useCustomerBooking } from "../context/CustomerBookingContext";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";

export default function ConfirmBookingScreen() {
    const navigation = useNavigation<any>();
    const { booking, setStage } = useCustomerBooking();

    const handleConfirm = () => {
        setStage("searching-technician");
        navigation.navigate("SearchingTechnician");
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Review your booking</Text>

            <View style={styles.card}>
                <Row label="Service" value={booking.service?.name ?? "-"} />
                <Row label="Address" value={booking.address || "-"} />
                <Row label="Date" value={booking.date || "-"} />
                <Row label="Slot" value={booking.slot || "-"} />
                <Row label="Amount" value={`Rs ${booking.service?.price ?? 0}`} />
            </View>

            <Pressable style={styles.primaryButton} onPress={handleConfirm}>
                <Text style={styles.primaryButtonText}>Confirm Booking</Text>
            </Pressable>
        </ScrollView>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
    title: {
        color: colors.textPrimary,
        fontSize: typography.h2,
        fontWeight: "800",
        marginBottom: spacing.lg,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        ...shadow,
    },
    row: {
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: "#EEF2F6",
    },
    rowLabel: {
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    rowValue: {
        marginTop: 6,
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "700",
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
