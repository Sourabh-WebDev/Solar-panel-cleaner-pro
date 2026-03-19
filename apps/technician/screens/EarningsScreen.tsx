import { useEffect, useRef } from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import { dashboardStats, weeklyEarnings, weeklyJobs } from "../data/mockData";
import type { TechnicianTabParamList } from "../navigation/types";

type Props = BottomTabScreenProps<TechnicianTabParamList, "Earnings">;

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function EarningsScreen({}: Props) {
    const maxEarning = Math.max(...weeklyEarnings);
    const heroFade = useRef(new Animated.Value(0)).current;
    const heroRise = useRef(new Animated.Value(18)).current;
    const barAnims = useRef(weeklyEarnings.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(heroFade, {
                toValue: 1,
                duration: 500,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(heroRise, {
                toValue: 0,
                duration: 500,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.stagger(
                100,
                barAnims.map((value) =>
                    Animated.timing(value, {
                        toValue: 1,
                        duration: 700,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: false,
                    })
                )
            ),
        ]).start();
    }, [barAnims, heroFade, heroRise]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Earnings</Text>
                <Text style={styles.subtitle}>Weekly payout snapshot and completed jobs performance.</Text>

                <Animated.View
                    style={[
                        styles.heroCard,
                        {
                            opacity: heroFade,
                            transform: [{ translateY: heroRise }],
                        },
                    ]}
                >
                    <Text style={styles.heroLabel}>This week</Text>
                    <Text style={styles.heroAmount}>
                        Rs {weeklyEarnings.reduce((sum, value) => sum + value, 0).toLocaleString("en-IN")}
                    </Text>
                    <Text style={styles.heroHelper}>
                        Across {weeklyJobs.reduce((sum, value) => sum + value, 0)} completed jobs
                    </Text>
                </Animated.View>

                <View style={styles.chartCard}>
                    <Text style={styles.sectionTitle}>Weekly earnings</Text>
                    <View style={styles.chartRow}>
                        {weeklyEarnings.map((value, index) => (
                            <View key={dayLabels[index]} style={styles.chartColumn}>
                                <View style={styles.barTrack}>
                                    <Animated.View
                                        style={[
                                            styles.barFill,
                                            {
                                                height: barAnims[index].interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [8, Math.max((value / maxEarning) * 140, 20)],
                                                }),
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.barValue}>{weeklyJobs[index]}</Text>
                                <Text style={styles.barLabel}>{dayLabels[index]}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.statsList}>
                    {dashboardStats.map((stat) => (
                        <View key={stat.label} style={styles.statRow}>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                            <Text style={styles.statValue}>{stat.value}</Text>
                        </View>
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
    heroCard: {
        backgroundColor: colors.success,
        borderRadius: radius.lg,
        padding: spacing.lg,
        ...shadow,
    },
    heroLabel: {
        color: "#D6F4E3",
        fontSize: typography.caption,
        fontWeight: "700",
        textTransform: "uppercase",
    },
    heroAmount: {
        marginTop: spacing.sm,
        color: "#fff",
        fontSize: 32,
        fontWeight: "900",
    },
    heroHelper: {
        marginTop: 6,
        color: "#E7F9EF",
        fontSize: typography.caption,
    },
    chartCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        ...shadow,
    },
    sectionTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "800",
    },
    chartRow: {
        marginTop: spacing.lg,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    chartColumn: {
        alignItems: "center",
        width: "18%",
    },
    barTrack: {
        height: 140,
        width: 28,
        backgroundColor: "#E9EFF7",
        borderRadius: radius.pill,
        justifyContent: "flex-end",
        overflow: "hidden",
    },
    barFill: {
        width: "100%",
        backgroundColor: colors.primary,
        borderRadius: radius.pill,
    },
    barValue: {
        marginTop: spacing.sm,
        color: colors.textPrimary,
        fontSize: typography.caption,
        fontWeight: "700",
    },
    barLabel: {
        marginTop: 4,
        color: colors.textSecondary,
        fontSize: 11,
    },
    statsList: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadow,
    },
    statRow: {
        padding: spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    statLabel: {
        color: colors.textSecondary,
        fontSize: typography.body,
    },
    statValue: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "800",
    },
});
