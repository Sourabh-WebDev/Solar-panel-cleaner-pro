import { Ionicons } from "@expo/vector-icons";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { technicianStats } from "../../../shared/api/api";
import TechnicianScreenHeader from "../../../shared/components/TechnicianScreenHeader";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import { useTechnicianLocation } from "../context/TechnicianLocationContext";
import { assignedJobs, dashboardStats, incomingRequests } from "../data/mockData";
import type { TechnicianRootStackParamList, TechnicianTabParamList } from "../navigation/types";

type Props = CompositeScreenProps<
    BottomTabScreenProps<TechnicianTabParamList, "Dashboard">,
    NativeStackScreenProps<TechnicianRootStackParamList>
>;

export default function DashboardScreen({ navigation }: Props) {
    const [isOnline, setIsOnline] = useState(true);
    const featuredRequest = incomingRequests[0];
    const {
        currentLocation,
        isTracking,
        isUsingCachedLocation,
        lastUpdatedAt,
        trackingError,
        retryTracking,
    } = useTechnicianLocation();
    const activeJob = useMemo(
        () => assignedJobs.find((job) => job.status === "In Progress") ?? assignedJobs[0],
        []
    );
    const activeAssignedJob = useMemo(
        () => assignedJobs.find((job) => job.status === "Accepted" || job.status === "In Progress"),
        []
    );

    return (
        <LinearGradient colors={["#F4F7FB", "#E8EEF7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientContainer}>
            <SafeAreaView style={styles.container}>
                {/* Decorative background elements */}
                <View style={styles.decorativeBlob1} />
                <View style={styles.decorativeBlob2} />

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
                    <View style={styles.heroCard}>
                        <View style={styles.heroTopRow}>
                            <Text style={styles.heroEyebrow}>Technician dashboard</Text>
                            <View style={[styles.heroStatusPill, isOnline && styles.heroStatusPillOnline]}>
                                <View style={[styles.heroStatusDot, isOnline && styles.heroStatusDotOnline]} />
                                <Text style={[styles.heroStatusText, isOnline && styles.heroStatusTextOnline]}>
                                    {isOnline ? "Online" : "Offline"}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.heroTitle}>
                            {isOnline ? "Ready for your next service run" : "Go online and start receiving requests"}
                        </Text>
                        <Text style={styles.heroSubtitle}>
                            {isOnline
                                ? "Requests are active. Respond quickly to keep your acceptance streak strong."
                                : "Turn online to unlock nearby jobs and increase your daily earnings."}
                        </Text>
                    </View>

                    <View style={styles.statsGrid}>
                        {dashboardStats.map((stat) => (
                            <View key={stat.label} style={styles.statCard}>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statHelper}>{stat.helper}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.locationCard}>
                        <Text style={styles.locationTitle}>Live location</Text>
                        <Text style={styles.locationStatus}>
                            {isTracking ? "GPS is being sent from this device." : "GPS tracking is not active."}
                        </Text>
                        <Text style={styles.locationCache}>
                            {isUsingCachedLocation ? "Location cache active" : "Live location feed active"}
                        </Text>
                        <Text style={styles.locationCoords}>
                            {currentLocation
                                ? `${currentLocation.latitude.toFixed(5)}, ${currentLocation.longitude.toFixed(5)}`
                                : "Waiting for first coordinate"}
                        </Text>
                        {lastUpdatedAt ? <Text style={styles.locationMeta}>Last updated at {lastUpdatedAt}</Text> : null}
                        {trackingError ? <Text style={styles.locationError}>{trackingError}</Text> : null}
                        {trackingError ? (
                            <Pressable style={styles.retryChip} onPress={() => void retryTracking()}>
                                <Text style={styles.retryChipText}>Retry system</Text>
                            </Pressable>
                        ) : null}
                    </View>

                    {featuredRequest ? (
                        <>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Incoming request</Text>
                                <Pressable onPress={() => navigation.navigate("JobRequestPopup", { job: featuredRequest })}>
                                    <Text style={styles.linkText}>Review</Text>
                                </Pressable>
                            </View>
                            {activeAssignedJob ? (
                                <Text style={styles.limitBanner}>
                                    Multiple requests can arrive, but only 1 active job can be handled at a time.
                                </Text>
                            ) : null}

                            <Pressable
                                style={styles.requestCard}
                                onPress={() => navigation.navigate("JobRequestPopup", { job: featuredRequest })}
                            >
                                <View>
                                    <Text style={styles.requestService}>{featuredRequest.service}</Text>
                                    <Text style={styles.requestMeta}>{featuredRequest.customer}</Text>
                                    <Text style={styles.requestMeta}>{featuredRequest.distance}</Text>
                                </View>
                                <Text style={styles.requestPayout}>Rs {featuredRequest.payout}</Text>
                            </Pressable>
                        </>
                    ) : null}

                    <Text style={styles.sectionTitle}>Active job</Text>

                    <View style={styles.activeJobCard}>
                        <View style={styles.activeJobTop}>
                            <View>
                                <Text style={styles.activeJobTitle}>{activeJob.customer}</Text>
                                <Text style={styles.activeJobSubtitle}>{activeJob.service}</Text>
                            </View>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>{activeJob.status}</Text>
                            </View>
                        </View>

                        <View style={styles.metaRow}>
                            <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
                            <Text style={styles.metaText}>{activeJob.address}</Text>
                        </View>

                        <View style={styles.metaRow}>
                            <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
                            <Text style={styles.metaText}>{activeJob.scheduledTime}</Text>
                        </View>

                        <View style={styles.actionRow}>
                            <Pressable
                                style={styles.secondaryButton}
                                onPress={() => navigation.navigate("Map", { job: activeJob })}
                            >
                                <Text style={styles.secondaryText}>Open map</Text>
                            </Pressable>
                            <Pressable
                                style={styles.primaryButton}
                                onPress={() => navigation.navigate("JobProgress", { job: activeJob })}
                            >
                                <Text style={styles.primaryText}>Continue</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    container: {
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
    content: {
        padding: spacing.lg,
        gap: spacing.md,
    },
    heroCard: {
        backgroundColor: "#10243E",
        borderRadius: radius.lg,
        padding: spacing.lg,
        gap: spacing.sm,
        ...shadow,
    },
    heroTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacing.sm,
    },
    heroEyebrow: {
        color: "#9DB1CC",
        fontSize: typography.caption,
        fontWeight: "700",
        textTransform: "uppercase",
        flex: 1,
    },
    heroStatusPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#FFFFFF14",
        borderRadius: radius.pill,
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
    },
    heroStatusPillOnline: {
        backgroundColor: "#D9F5E6",
    },
    heroStatusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#F04438",
    },
    heroStatusDotOnline: {
        backgroundColor: colors.success,
    },
    heroStatusText: {
        color: "#FFD5D2",
        fontSize: 12,
        fontWeight: "800",
    },
    heroStatusTextOnline: {
        color: "#085D3A",
    },
    heroTitle: {
        marginTop: spacing.xs,
        color: "#fff",
        fontSize: typography.h3,
        fontWeight: "900",
        lineHeight: 30,
    },
    heroSubtitle: {
        marginTop: 6,
        color: "#C8D5E8",
        fontSize: typography.body,
        fontWeight: "500",
        lineHeight: 20,
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: spacing.sm,
    },
    statCard: {
        width: "48%",
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        ...shadow,
    },
    statLabel: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    statValue: {
        marginTop: spacing.sm,
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "800",
    },
    statHelper: {
        marginTop: 4,
        color: colors.textSecondary,
        fontSize: 11,
    },
    locationCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        gap: 4,
        ...shadow,
    },
    locationTitle: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "800",
    },
    locationStatus: {
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    locationCoords: {
        marginTop: spacing.xs,
        color: colors.primary,
        fontSize: typography.body,
        fontWeight: "700",
    },
    locationCache: {
        color: colors.textPrimary,
        fontSize: typography.caption,
        fontWeight: "700",
    },
    locationMeta: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    locationError: {
        color: "#B42318",
        fontSize: typography.caption,
        lineHeight: 18,
    },
    retryChip: {
        alignSelf: "flex-start",
        backgroundColor: colors.chip,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.sm,
        paddingVertical: 8,
    },
    retryChipText: {
        color: colors.primary,
        fontSize: typography.caption,
        fontWeight: "700",
    },
    sectionHeader: {
        marginTop: spacing.xs,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sectionTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "800",
    },
    linkText: {
        color: colors.primary,
        fontSize: typography.caption,
        fontWeight: "700",
    },
    limitBanner: {
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
    requestService: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "800",
    },
    requestMeta: {
        marginTop: 2,
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    requestPayout: {
        color: colors.success,
        fontSize: typography.h3,
        fontWeight: "900",
    },
    activeJobCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        gap: spacing.sm,
        ...shadow,
    },
    activeJobTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    activeJobTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "800",
    },
    activeJobSubtitle: {
        marginTop: 4,
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    statusBadge: {
        backgroundColor: colors.chip,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
    },
    statusText: {
        color: colors.primary,
        fontSize: typography.caption,
        fontWeight: "700",
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
    },
    metaText: {
        flex: 1,
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    actionRow: {
        marginTop: spacing.sm,
        flexDirection: "row",
        gap: spacing.sm,
    },
    secondaryButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingVertical: 13,
        alignItems: "center",
    },
    secondaryText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "700",
    },
    primaryButton: {
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        paddingVertical: 13,
        alignItems: "center",
    },
    primaryText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "700",
    },
});
