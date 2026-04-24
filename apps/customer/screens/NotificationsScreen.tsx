import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
        <LinearGradient colors={["#F4F7FB", "#E8EEF7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientContainer}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.decorativeBlob1} />
                <View style={styles.decorativeBlob2} />
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
