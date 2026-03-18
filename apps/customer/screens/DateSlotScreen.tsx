import { useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useCustomerBooking } from "../context/CustomerBookingContext";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";

const slots = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
];

export default function DateSlotScreen() {
    const navigation = useNavigation<any>();
    const { booking, setSchedule } = useCustomerBooking();
    const nextDays = useMemo(
        () =>
            Array.from({ length: 5 }, (_, index) => {
                const date = new Date();
                date.setDate(date.getDate() + index);

                return date.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    weekday: "short",
                });
            }),
        []
    );

    const [selectedDate, setSelectedDate] = useState(booking.date || nextDays[0]);
    const [selectedSlot, setSelectedSlot] = useState(booking.slot || slots[1]);

    const handleContinue = () => {
        setSchedule(selectedDate, selectedSlot);
        navigation.navigate("ConfirmBooking");
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Select Date</Text>

            <View style={styles.rowWrap}>
                {nextDays.map((day) => (
                    <Pressable
                        key={day}
                        style={[styles.choiceChip, selectedDate === day && styles.choiceChipActive]}
                        onPress={() => setSelectedDate(day)}
                    >
                        <Text
                            style={[
                                styles.choiceChipText,
                                selectedDate === day && styles.choiceChipTextActive,
                            ]}
                        >
                            {day}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={[styles.sectionTitle, styles.spacedTitle]}>Select Time Slot</Text>

            {slots.map((slot) => (
                <Pressable
                    key={slot}
                    style={[styles.slotCard, selectedSlot === slot && styles.choiceChipActive]}
                    onPress={() => setSelectedSlot(slot)}
                >
                    <Text
                        style={[
                            styles.slotText,
                            selectedSlot === slot && styles.choiceChipTextActive,
                        ]}
                    >
                        {slot}
                    </Text>
                </Pressable>
            ))}

            <Pressable style={styles.primaryButton} onPress={handleContinue}>
                <Text style={styles.primaryButtonText}>Continue to Confirmation</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
    sectionTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "800",
        marginBottom: spacing.md,
    },
    spacedTitle: {
        marginTop: spacing.lg,
    },
    rowWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.sm,
    },
    choiceChip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    choiceChipActive: {
        borderColor: colors.primary,
        backgroundColor: "#EDF5FF",
    },
    choiceChipText: {
        color: colors.textSecondary,
        fontSize: typography.caption,
        fontWeight: "700",
    },
    choiceChipTextActive: {
        color: colors.primary,
    },
    slotCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...shadow,
    },
    slotText: {
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
