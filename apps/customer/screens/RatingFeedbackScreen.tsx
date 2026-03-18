import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";

import { useCustomerBooking } from "../context/CustomerBookingContext";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";

export default function RatingFeedbackScreen() {
    const navigation = useNavigation<any>();
    const { booking, setFeedback } = useCustomerBooking();
    const [rating, setRating] = useState(booking.rating || 5);
    const [feedback, setFeedbackText] = useState(booking.feedback);

    const handleSubmit = () => {
        setFeedback(rating, feedback);
        Alert.alert("Thank You", "Your rating and feedback have been submitted.");
        navigation.navigate("MainTabs", { screen: "Services" });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>How was your service?</Text>

            <Text style={styles.subtitle}>
                Rate the completed booking and share a quick note for the technician.
            </Text>

            <Text style={styles.starsLabel}>Your Rating</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable key={star} onPress={() => setRating(star)}>
                        <Ionicons
                            name={star <= rating ? "star" : "star-outline"}
                            size={34}
                            color="#F5A623"
                        />
                    </Pressable>
                ))}
            </ScrollView>

            <TextInput
                value={feedback}
                onChangeText={setFeedbackText}
                placeholder="Write your feedback"
                placeholderTextColor={colors.textSecondary}
                multiline
                style={styles.input}
            />

            <Pressable style={styles.primaryButton} onPress={handleSubmit}>
                <Text style={styles.primaryButtonText}>Submit Feedback</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
    title: {
        color: colors.textPrimary,
        fontSize: typography.h2,
        fontWeight: "800",
        marginBottom: spacing.xs,
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: typography.body,
        marginBottom: spacing.lg,
    },
    starsLabel: {
        color: colors.textPrimary,
        fontSize: typography.caption,
        fontWeight: "700",
        marginBottom: spacing.sm,
    },
    starsRow: {
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    input: {
        minHeight: 140,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        padding: spacing.md,
        textAlignVertical: "top",
        color: colors.textPrimary,
        fontSize: typography.body,
        ...shadow,
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
