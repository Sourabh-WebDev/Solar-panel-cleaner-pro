import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, Vibration, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import { assignedJobs } from "../data/mockData";
import type { TechnicianRootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<TechnicianRootStackParamList, "JobRequestPopup">;

const REQUEST_ALERT_SOUND =
    "data:audio/wav;base64,UklGRlQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTAAAAAAAP//AAD//wAA//8AAP//AAD//wAA";

export default function JobRequestPopup({ navigation, route }: Props) {
    const { job } = route.params;
    const commission = Math.round(job.payout * 0.1);
    const rupee = "\u20B9";
    const [countdown, setCountdown] = useState(20);
    const activeAssignedJob = assignedJobs.find(
        (assignedJob) =>
            assignedJob.status === "Accepted" || assignedJob.status === "In Progress"
    );
    const canAcceptJob = !activeAssignedJob;
    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        let player: ReturnType<typeof createAudioPlayer> | null = null;

        const playAlert = async () => {
            try {
                await setAudioModeAsync({
                    playsInSilentMode: true,
                    shouldPlayInBackground: false,
                });
                player = createAudioPlayer({ uri: REQUEST_ALERT_SOUND });
                player.volume = 1;
                player.play();
            } catch {
                Vibration.vibrate(300);
            }
        };

        void playAlert();

        const pulseLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1.04,
                    duration: 650,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 650,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        pulseLoop.start();

        return () => {
            pulseLoop.stop();
            if (player) {
                player.remove();
            }
        };
    }, [pulse]);

    useEffect(() => {
        if (countdown <= 0) {
            const closeTimer = setTimeout(() => {
                navigation.goBack();
            }, 0);

            return () => clearTimeout(closeTimer);
        }

        const tickTimer = setTimeout(() => {
            setCountdown((current) => Math.max(current - 1, 0));
        }, 1000);

        return () => clearTimeout(tickTimer);
    }, [countdown, navigation]);

    return (
        <SafeAreaView style={styles.overlay}>
            <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

            <View style={styles.sheet}>
                <Text style={styles.heading}>New Request</Text>
                <View style={styles.countdownPill}>
                    <Text style={styles.countdownText}>Auto close in {countdown}s</Text>
                </View>

                <View style={styles.metricCard}>
                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>Service</Text>
                        <Text style={styles.metricValue}>{job.service}</Text>
                    </View>
                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>Distance</Text>
                        <Text style={styles.metricValue}>{job.distance}</Text>
                    </View>
                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>Earning</Text>
                        <Text style={styles.earningValue}>{rupee}{job.payout}</Text>
                    </View>
                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>Commission</Text>
                        <Text style={styles.metricValue}>
                            {rupee}{commission} (10%)
                        </Text>
                    </View>
                </View>

                <Text style={styles.metaText}>{job.customer}</Text>
                <Text style={styles.metaText}>{job.address}</Text>
                {activeAssignedJob ? (
                    <View style={styles.limitCard}>
                        <Text style={styles.limitTitle}>1 active job at a time</Text>
                        <Text style={styles.limitText}>
                            Finish or cancel {activeAssignedJob.id} before accepting another request.
                        </Text>
                    </View>
                ) : null}

                <View style={styles.actions}>
                    <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.secondaryText}>Reject</Text>
                    </Pressable>
                    <Animated.View style={[styles.primaryWrap, { transform: [{ scale: pulse }] }]}>
                        <Pressable
                            style={[styles.primaryButton, !canAcceptJob && styles.disabledButton]}
                            disabled={!canAcceptJob}
                            onPress={() => {
                                navigation.replace("Map", { job: { ...job, status: "Accepted" } });
                            }}
                        >
                            <Text style={styles.primaryText}>ACCEPT</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#0E1E324D",
        padding: spacing.lg,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    sheet: {
        backgroundColor: colors.surface,
        borderRadius: 28,
        padding: spacing.lg,
        gap: spacing.md,
        ...shadow,
    },
    heading: {
        color: colors.textPrimary,
        fontSize: 26,
        fontWeight: "900",
        textAlign: "center",
    },
    countdownPill: {
        alignSelf: "center",
        backgroundColor: colors.chip,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
    },
    countdownText: {
        color: colors.primary,
        fontSize: typography.caption,
        fontWeight: "800",
    },
    metricCard: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.md,
        gap: spacing.sm,
        backgroundColor: colors.background,
    },
    metricRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacing.sm,
    },
    metricLabel: {
        color: colors.textSecondary,
        fontSize: typography.body,
    },
    metricValue: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "700",
    },
    earningValue: {
        color: colors.success,
        fontSize: typography.h3,
        fontWeight: "900",
    },
    metaText: {
        color: colors.textSecondary,
        fontSize: typography.caption,
        textAlign: "center",
    },
    limitCard: {
        backgroundColor: "#FFF3F1",
        borderWidth: 1,
        borderColor: "#F3C9C5",
        borderRadius: radius.md,
        padding: spacing.md,
        gap: 4,
    },
    limitTitle: {
        color: "#B42318",
        fontSize: typography.body,
        fontWeight: "800",
    },
    limitText: {
        color: "#7A271A",
        fontSize: typography.caption,
        lineHeight: 18,
    },
    actions: {
        flexDirection: "row",
        gap: spacing.sm,
        alignItems: "stretch",
    },
    secondaryButton: {
        flex: 0.8,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingVertical: 14,
        alignItems: "center",
    },
    primaryWrap: {
        flex: 1.2,
    },
    secondaryText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "800",
    },
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        paddingVertical: 18,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 64,
        ...shadow,
    },
    disabledButton: {
        backgroundColor: "#AAB7C8",
    },
    primaryText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "800",
    },
});
