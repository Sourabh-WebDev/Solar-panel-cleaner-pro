import { useNavigation } from "@react-navigation/native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useCustomerBooking } from "../context/CustomerBookingContext";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";

export default function SearchingTechnicianScreen() {
    const navigation = useNavigation<any>();
    const { booking, setStage } = useCustomerBooking();

    const handleNext = () => {
        setStage("technician-assigned");
        navigation.navigate("TechnicianAssigned");
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.hero}>
                <Text style={styles.heroTitle}>Searching for technician</Text>
                <Text style={styles.heroText}>
                    We are matching the best nearby technician for {booking.service?.name}.
                </Text>
            </View>

            <FlowCard
                step="Booking Confirmed"
                text={`${booking.date} | ${booking.slot}`}
                active
            />
            <FlowCard
                step="Finding Technician"
                text="Checking nearby availability and route distance"
                active
            />
            <FlowCard
                step="Assignment in Progress"
                text="Expected confirmation in less than 2 minutes"
            />

            <Pressable style={styles.primaryButton} onPress={handleNext}>
                <Text style={styles.primaryButtonText}>Simulate Technician Assigned</Text>
            </Pressable>
        </ScrollView>
    );
}

function FlowCard({ step, text, active = false }: { step: string; text: string; active?: boolean }) {
    return (
        <View style={[styles.flowCard, active && styles.flowCardActive]}>
            <Text style={styles.flowTitle}>{step}</Text>
            <Text style={styles.flowText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
    hero: {
        backgroundColor: colors.primary,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...shadow,
    },
    heroTitle: {
        color: "#fff",
        fontSize: typography.h2,
        fontWeight: "800",
    },
    heroText: {
        marginTop: spacing.sm,
        color: "#E8F2FF",
        fontSize: typography.body,
        lineHeight: 22,
    },
    flowCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    flowCardActive: {
        borderColor: colors.primary,
    },
    flowTitle: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "800",
    },
    flowText: {
        marginTop: 6,
        color: colors.textSecondary,
        fontSize: typography.caption,
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
