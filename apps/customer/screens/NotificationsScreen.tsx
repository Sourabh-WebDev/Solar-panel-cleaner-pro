import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";

const notifications = [
    {
        id: "n1",
        title: "Technician Assigned",
        body: "Rahul Kumar has accepted your solar cleaning request.",
    },
    {
        id: "n2",
        title: "Booking Confirmed",
        body: "Your service slot for tomorrow at 11:00 AM is confirmed.",
    },
    {
        id: "n3",
        title: "Offer Available",
        body: "Get 20% off on your next panel maintenance booking.",
    },
];

export default function NotificationsScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>Recent updates about bookings and offers.</Text>

            {notifications.map((item) => (
                <View key={item.id} style={styles.card}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardBody}>{item.body}</Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
    card: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadow,
    },
    cardTitle: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "800",
    },
    cardBody: {
        marginTop: spacing.sm,
        color: colors.textSecondary,
        fontSize: typography.body,
        lineHeight: 22,
    },
});
