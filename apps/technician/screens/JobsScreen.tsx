import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { technicianStats } from "../../../shared/api/api";
import TechnicianScreenHeader from "../../../shared/components/TechnicianScreenHeader";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import { assignedJobs, incomingRequests } from "../data/mockData";
import type { TechnicianRootStackParamList, TechnicianTabParamList } from "../navigation/types";

type Props = CompositeScreenProps<
    BottomTabScreenProps<TechnicianTabParamList, "Jobs">,
    NativeStackScreenProps<TechnicianRootStackParamList>
>;

export default function JobsScreen({ navigation }: Props) {
    const [isOnline, setIsOnline] = useState(true);
    const activeAssignedJob = assignedJobs.find(
        (job) => job.status === "Accepted" || job.status === "In Progress"
    );
    const featuredRequest = incomingRequests[0];

    return (
        <SafeAreaView style={styles.container}>
            {featuredRequest ? (
                <TechnicianScreenHeader
                    isOnline={isOnline}
                    onOnlineChange={setIsOnline}
                    todayEarnings={technicianStats.earnings}
                    onNotificationPress={() => navigation.navigate("JobRequestPopup", { job: featuredRequest })}
                    onProfilePress={() => navigation.navigate("Profile")}
                    showNotification={!!featuredRequest}
                />
            ) : (
                <TechnicianScreenHeader
                    isOnline={isOnline}
                    onOnlineChange={setIsOnline}
                    todayEarnings={technicianStats.earnings}
                    onNotificationPress={() => { }}
                    onProfilePress={() => navigation.navigate("Profile")}
                    showNotification={false}
                />
            )}
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Jobs</Text>
                <Text style={styles.subtitle}>Track new requests and jump into active field work.</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pending requests</Text>
                    {activeAssignedJob ? (
                        <Text style={styles.limitText}>
                            1 active job at a time. New requests can be reviewed, but not accepted until the active job is finished or cancelled.
                        </Text>
                    ) : null}
                    {incomingRequests.map((job) => (
                        <Pressable
                            key={job.id}
                            style={styles.requestCard}
                            onPress={() => navigation.navigate("JobRequestPopup", { job })}
                        >
                            <View>
                                <Text style={styles.cardTitle}>{job.customer}</Text>
                                <Text style={styles.cardMeta}>{job.service}</Text>
                                <Text style={styles.cardMeta}>{job.distance}</Text>
                            </View>
                            <Text style={styles.amount}>Rs {job.payout}</Text>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Assigned jobs</Text>
                    {assignedJobs.map((job) => (
                        <Pressable
                            key={job.id}
                            style={styles.jobCard}
                            onPress={() => navigation.navigate("JobDetails", { job })}
                        >
                            <View style={styles.cardTop}>
                                <Text style={styles.cardTitle}>{job.customer}</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>{job.status}</Text>
                                </View>
                            </View>
                            <Text style={styles.cardMeta}>{job.service}</Text>
                            <Text style={styles.cardMeta}>{job.address}</Text>
                            <Text style={styles.cardMeta}>{job.scheduledTime}</Text>
                        </Pressable>
                    ))}
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
        gap: spacing.lg,
    },
    title: {
        color: colors.textPrimary,
        fontSize: 28,
        fontWeight: "900",
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: typography.body,
        lineHeight: 22,
    },
    section: {
        gap: spacing.sm,
    },
    sectionTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "800",
    },
    limitText: {
        color: "#B42318",
        fontSize: typography.caption,
        lineHeight: 18,
    },
    requestCard: {
        backgroundColor: "#FFF5E9",
        borderRadius: radius.lg,
        padding: spacing.md,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    jobCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        gap: 4,
        ...shadow,
    },
    cardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacing.sm,
    },
    cardTitle: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "800",
    },
    cardMeta: {
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    amount: {
        color: colors.success,
        fontSize: typography.h3,
        fontWeight: "900",
    },
    statusBadge: {
        backgroundColor: colors.chip,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
    },
    statusText: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: "700",
    },
});
