import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import type { TechnicianRootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<TechnicianRootStackParamList, "CancelJobWarning">;

export default function CancelJobWarningScreen({ navigation, route }: Props) {
    const { job } = route.params;

    const handleConfirmCancel = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: "MainTabs" }],
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <View style={styles.iconWrap}>
                        <Ionicons name="warning-outline" size={30} color="#fff" />
                    </View>
                    <Text style={styles.heroTitle}>Cancel job</Text>
                    <Text style={styles.heroSubtitle}>
                        Cancelling an accepted job will trigger a warning and the booking will be reassigned.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Penalty / warning</Text>
                    <Text style={styles.description}>
                        This cancellation may reduce your priority for upcoming requests and can apply a penalty
                        review to your technician account.
                    </Text>

                    <View style={styles.warningRow}>
                        <Text style={styles.warningLabel}>Accepted job</Text>
                        <Text style={styles.warningValue}>{job.service}</Text>
                    </View>
                    <View style={styles.warningRow}>
                        <Text style={styles.warningLabel}>Customer</Text>
                        <Text style={styles.warningValue}>{job.customer}</Text>
                    </View>
                    <View style={styles.warningRow}>
                        <Text style={styles.warningLabel}>Penalty status</Text>
                        <Text style={styles.warningAccent}>Warning applied</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Reassign job</Text>
                    <Text style={styles.description}>
                        Once you confirm, the system will release this job and reassign it to another available technician.
                    </Text>
                </View>

                <View style={styles.actions}>
                    <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.secondaryText}>Keep job</Text>
                    </Pressable>
                    <Pressable style={styles.dangerButton} onPress={handleConfirmCancel}>
                        <Text style={styles.dangerText}>Confirm cancel</Text>
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
    hero: {
        backgroundColor: "#8C1D18",
        borderRadius: radius.lg,
        padding: spacing.lg,
        alignItems: "center",
        ...shadow,
    },
    iconWrap: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#FFFFFF22",
        alignItems: "center",
        justifyContent: "center",
    },
    heroTitle: {
        marginTop: spacing.md,
        color: "#fff",
        fontSize: typography.h2,
        fontWeight: "900",
    },
    heroSubtitle: {
        marginTop: spacing.sm,
        color: "#F7D8D5",
        fontSize: typography.body,
        lineHeight: 22,
        textAlign: "center",
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        gap: spacing.sm,
        ...shadow,
    },
    sectionTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "800",
    },
    description: {
        color: colors.textSecondary,
        fontSize: typography.body,
        lineHeight: 22,
    },
    warningRow: {
        paddingTop: spacing.xs,
    },
    warningLabel: {
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    warningValue: {
        marginTop: 4,
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "700",
    },
    warningAccent: {
        marginTop: 4,
        color: "#B42318",
        fontSize: typography.body,
        fontWeight: "800",
    },
    actions: {
        flexDirection: "row",
        gap: spacing.sm,
    },
    secondaryButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingVertical: 14,
        alignItems: "center",
    },
    secondaryText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "700",
    },
    dangerButton: {
        flex: 1,
        backgroundColor: "#B42318",
        borderRadius: radius.md,
        paddingVertical: 14,
        alignItems: "center",
    },
    dangerText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "800",
    },
});
