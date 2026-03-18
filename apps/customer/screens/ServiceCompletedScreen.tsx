import { useNavigation } from "@react-navigation/native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useCustomerBooking } from "../context/CustomerBookingContext";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";

export default function ServiceCompletedScreen() {
    const navigation = useNavigation<any>();
    const { booking, setStage } = useCustomerBooking();

    const handleRate = () => {
        setStage("rating-feedback");
        navigation.navigate("RatingFeedback");
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.hero}>
                <Text style={styles.heroTitle}>Service completed successfully</Text>
                <Text style={styles.heroText}>
                    {booking.service?.name} has been completed at your selected location.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardText}>Technician: {booking.technicianName}</Text>
                <Text style={styles.cardText}>Date: {booking.date}</Text>
                <Text style={styles.cardText}>Slot: {booking.slot}</Text>
            </View>

            <Pressable style={styles.primaryButton} onPress={handleRate}>
                <Text style={styles.primaryButtonText}>Rate & Give Feedback</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
    hero: {
        backgroundColor: "#EAF8F0",
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...shadow,
    },
    heroTitle: {
        color: colors.success,
        fontSize: typography.h2,
        fontWeight: "800",
    },
    heroText: {
        marginTop: spacing.sm,
        color: colors.textSecondary,
        fontSize: typography.body,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        ...shadow,
    },
    cardText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        marginBottom: spacing.sm,
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
