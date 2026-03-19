import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import type { TechnicianRootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<TechnicianRootStackParamList, "JobProgress">;

const stages = [
    { key: "arrival", label: "Arrived at location", detail: "Update customer that you are on-site." },
    { key: "inspection", label: "Inspection completed", detail: "Checked panels and access points." },
    { key: "cleaning", label: "Cleaning in progress", detail: "Main wash and foam cycle underway." },
    { key: "wrap", label: "Final review", detail: "Photo capture and closeout before marking done." },
];

export default function JobProgressScreen({ navigation, route }: Props) {
    const { job } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>Job progress</Text>
                    <Text style={styles.heroSubtitle}>
                        {job.customer} · {job.service}
                    </Text>
                </View>

                {stages.map((stage, index) => (
                    <View key={stage.key} style={styles.stageCard}>
                        <View style={styles.stageIcon}>
                            <Ionicons
                                name={index < 2 ? "checkmark-outline" : "ellipse-outline"}
                                size={20}
                                color={index < 2 ? colors.success : colors.textSecondary}
                            />
                        </View>
                        <View style={styles.stageText}>
                            <Text style={styles.stageTitle}>{stage.label}</Text>
                            <Text style={styles.stageDetail}>{stage.detail}</Text>
                        </View>
                    </View>
                ))}

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Customer note</Text>
                    <Text style={styles.summaryText}>{job.notes}</Text>
                </View>

                <Pressable
                    style={styles.cancelButton}
                    onPress={() => navigation.navigate("CancelJobWarning", { job })}
                >
                    <Text style={styles.cancelText}>Cancel job</Text>
                </Pressable>

                <Pressable style={styles.primaryButton} onPress={() => navigation.navigate("MainTabs")}>
                    <Text style={styles.primaryText}>Mark job completed</Text>
                </Pressable>
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
    hero: {
        backgroundColor: "#10243E",
        borderRadius: radius.lg,
        padding: spacing.lg,
        ...shadow,
    },
    heroTitle: {
        color: "#fff",
        fontSize: typography.h2,
        fontWeight: "800",
    },
    heroSubtitle: {
        marginTop: 6,
        color: "#CFD7E5",
        fontSize: typography.body,
    },
    stageCard: {
        flexDirection: "row",
        gap: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        ...shadow,
    },
    stageIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
    },
    stageText: {
        flex: 1,
    },
    stageTitle: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "700",
    },
    stageDetail: {
        marginTop: 4,
        color: colors.textSecondary,
        fontSize: typography.caption,
        lineHeight: 18,
    },
    summaryCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
    },
    summaryTitle: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "700",
    },
    summaryText: {
        marginTop: spacing.xs,
        color: colors.textSecondary,
        fontSize: typography.body,
        lineHeight: 22,
    },
    primaryButton: {
        backgroundColor: colors.success,
        borderRadius: radius.md,
        paddingVertical: 15,
        alignItems: "center",
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: "#F3C9C5",
        backgroundColor: "#FFF3F1",
        borderRadius: radius.md,
        paddingVertical: 15,
        alignItems: "center",
    },
    cancelText: {
        color: "#B42318",
        fontSize: typography.body,
        fontWeight: "800",
    },
    primaryText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "700",
    },
});
