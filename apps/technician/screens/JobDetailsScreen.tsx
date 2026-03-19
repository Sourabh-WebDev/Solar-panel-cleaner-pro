import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import type { TechnicianRootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<TechnicianRootStackParamList, "JobDetails">;

const infoRows = [
    { key: "service", label: "Service" },
    { key: "address", label: "Address" },
    { key: "scheduledTime", label: "Schedule" },
    { key: "distance", label: "Distance" },
    { key: "phone", label: "Phone" },
] as const;

export default function JobDetailsScreen({ navigation, route }: Props) {
    const { job } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.heroCard}>
                    <View style={styles.heroTopRow}>
                        <View>
                            <Text style={styles.heroTitle}>{job.customer}</Text>
                            <Text style={styles.heroSubtitle}>{job.id}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{job.status}</Text>
                        </View>
                    </View>

                    <Text style={styles.heroAmount}>Rs {job.payout}</Text>
                    <Text style={styles.heroHelper}>Expected payout for this visit</Text>
                </View>

                <View style={styles.sectionCard}>
                    {infoRows.map((row) => (
                        <View key={row.key} style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{row.label}</Text>
                            <Text style={styles.infoValue}>{job[row.key]}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Visit notes</Text>
                    <Text style={styles.noteText}>{job.notes}</Text>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Next actions</Text>
                    <Pressable style={styles.actionRow} onPress={() => navigation.navigate("Map", { job })}>
                        <Ionicons name="navigate-circle-outline" size={22} color={colors.primary} />
                        <View style={styles.actionTextWrap}>
                            <Text style={styles.actionTitle}>Open route map</Text>
                            <Text style={styles.actionSubtitle}>Track arrival and update ETA</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        style={styles.actionRow}
                        onPress={() => navigation.navigate("JobProgress", { job })}
                    >
                        <Ionicons name="clipboard-outline" size={22} color={colors.primary} />
                        <View style={styles.actionTextWrap}>
                            <Text style={styles.actionTitle}>Start job progress</Text>
                            <Text style={styles.actionSubtitle}>Move the job through work stages</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        style={styles.cancelRow}
                        onPress={() => navigation.navigate("CancelJobWarning", { job })}
                    >
                        <Ionicons name="close-circle-outline" size={22} color="#B42318" />
                        <View style={styles.actionTextWrap}>
                            <Text style={styles.cancelTitle}>Cancel accepted job</Text>
                            <Text style={styles.actionSubtitle}>Warning will be applied and the job will be reassigned</Text>
                        </View>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
        gap: spacing.md,
    },
    heroCard: {
        backgroundColor: colors.primary,
        borderRadius: radius.lg,
        padding: spacing.lg,
        ...shadow,
    },
    heroTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    heroTitle: {
        color: "#fff",
        fontSize: typography.h2,
        fontWeight: "800",
    },
    heroSubtitle: {
        marginTop: 4,
        color: "#DDE9FF",
        fontSize: typography.caption,
    },
    statusBadge: {
        backgroundColor: "#FFFFFF22",
        borderRadius: radius.pill,
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
    },
    statusText: {
        color: "#fff",
        fontSize: typography.caption,
        fontWeight: "700",
    },
    heroAmount: {
        marginTop: spacing.xl,
        color: "#fff",
        fontSize: 30,
        fontWeight: "900",
    },
    heroHelper: {
        color: "#DDE9FF",
        fontSize: typography.caption,
    },
    sectionCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.md,
        gap: spacing.sm,
        ...shadow,
    },
    sectionTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "700",
    },
    infoRow: {
        paddingVertical: spacing.xs,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    infoLabel: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    infoValue: {
        marginTop: 4,
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "600",
    },
    noteText: {
        color: colors.textSecondary,
        fontSize: typography.body,
        lineHeight: 22,
    },
    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.md,
    },
    cancelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: "#F3C9C5",
        backgroundColor: "#FFF3F1",
        borderRadius: radius.md,
        padding: spacing.md,
    },
    actionTextWrap: {
        flex: 1,
    },
    actionTitle: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "700",
    },
    actionSubtitle: {
        marginTop: 2,
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    cancelTitle: {
        color: "#B42318",
        fontSize: typography.body,
        fontWeight: "700",
    },
});
