import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
    type NativeScrollEvent,
    type NativeSyntheticEvent
} from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { services } from "../../../shared/api/api";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";

type Service = {
    id: number;
    name: string;
    image: any;
    price: number;
};


type RootStackParamList = {
    Dashboard: undefined;
    Services: undefined;
    Address: { service: Service };
};

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

type Banner = {
    id: string;
    title: string;
    subtitle: string;
    highlight: string;
    colors: string[];
};

type ServiceMeta = {
    icon: "spray-bottle" | "water-circle" | "tools";
    duration: string;
    rating: number;
};

const bannerSlides = [
    {
        id: "banner-1",
        title: "Summer Solar Care",
        subtitle: "Deep cleaning packages with quick doorstep booking.",
        highlight: "20% OFF",
        colors: ["#0B6DFF", "#3AA0FF"]
    },
    {
        id: "banner-2",
        title: "Weekend Service Slots",
        subtitle: "Book Saturday and Sunday panel wash without waiting.",
        highlight: "Fast Booking",
        colors: ["#0F9D58", "#48C78E"]
    },
    {
        id: "banner-3",
        title: "Premium Maintenance",
        subtitle: "Cleaning, inspection and health check in one visit.",
        highlight: "Top Rated",
        colors: ["#FF8A00", "#FFB347"]
    }
];

const serviceMeta: Record<number, ServiceMeta> = {
    1: { icon: "spray-bottle", duration: "45 min", rating: 4.8 },
    2: { icon: "water-circle", duration: "60 min", rating: 4.9 },
    3: { icon: "tools", duration: "90 min", rating: 4.7 }
};

export default function DashboardScreen({ navigation }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeBannerIndex, setActiveBannerIndex] = useState(0);
    const { width } = useWindowDimensions();

    const filteredServices = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return services;
        }

        return services.filter((service) => service.name.toLowerCase().includes(query));
    }, [searchQuery]);

    const popularServices = filteredServices.slice(0, 4);
    const miniServices = filteredServices.slice(0, 6);
    const bannerCardWidth = Math.max(width - (spacing.lg * 2), 280);


    const handleBannerScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / bannerCardWidth);
        setActiveBannerIndex(index);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.searchBox}>
                <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} />
                <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search services"
                    placeholderTextColor={colors.textSecondary}
                    style={styles.searchInput}
                />
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Services</Text>
                <Pressable onPress={() => navigation.navigate("Services")} hitSlop={8}>
                    <Text style={styles.seeAllText}>See all</Text>
                </Pressable>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.servicesRow}
            >
                {miniServices.map((service) => {
                    const meta = serviceMeta[service.id];

                    return (
                        <Pressable
                            key={service.id}
                            style={styles.smallServiceCard}
                            onPress={() => navigation.navigate("Address", { service })}
                        >
                            <View style={styles.smallServiceIconWrap}>
                                <Image source={service.image} style={styles.smallServiceImage} />
                            </View>
                            <Text style={styles.smallServiceName} numberOfLines={2}>
                                {service.name}
                            </Text>
                            <View style={styles.smallServiceMeta}>
                                <MaterialCommunityIcons name={meta?.icon ?? "star"} size={12} color={colors.primary} />
                                <Text style={styles.smallServiceMetaText}>{meta?.duration ?? "45 min"}</Text>
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>

            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleBannerScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={bannerCardWidth}
                contentContainerStyle={styles.bannerRow}
            >
                {bannerSlides.map((banner) => (
                    <View
                        key={banner.id}
                        style={[
                            styles.bannerCard,
                            {
                                width: bannerCardWidth,
                                backgroundColor: banner.colors[0]
                            }
                        ]}
                    >
                        <View style={styles.bannerBadge}>
                            <Text style={styles.bannerBadgeText}>{banner.highlight}</Text>
                        </View>
                        <Text style={styles.bannerTitle}>{banner.title}</Text>
                        <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.dotsRow}>
                {bannerSlides.map((banner, index) => (
                    <View
                        key={banner.id}
                        style={[
                            styles.dot,
                            index === activeBannerIndex && styles.activeDot
                        ]}
                    />
                ))}
            </View>

            <Text style={styles.sectionTitle}>Popular Services</Text>

            <View style={styles.popularGrid}>
                {popularServices.map((service) => {
                    const meta = serviceMeta[service.id];

                    return (
                        <Pressable
                            key={service.id}
                            style={styles.popularCard}
                            onPress={() => navigation.navigate("Address", { service })}
                        >
                            <Image source={service.image} style={styles.popularImage} />

                            <View style={styles.ratingRow}>
                                <MaterialCommunityIcons name="star" size={14} color="#F5A623" />
                                <Text style={styles.ratingText}>{meta?.rating ?? 4.8}</Text>
                            </View>

                            <Text style={styles.popularName} numberOfLines={2}>
                                {service.name}
                            </Text>

                            <View style={styles.infoRow}>
                                <MaterialCommunityIcons name="clock-outline" size={14} color={colors.textSecondary} />
                                <Text style={styles.infoText}>{meta?.duration ?? "45 min"}</Text>
                            </View>

                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Starting at</Text>
                                <Text style={styles.priceText}>Rs {service.price}</Text>
                            </View>
                        </Pressable>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },

    content: {
        padding: spacing.lg,
        paddingBottom: spacing.xl * 2
    },

    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.md,
        paddingVertical: 2,
        ...shadow
    },

    searchInput: {
        flex: 1,
        paddingVertical: 12,
        color: colors.textPrimary,
        fontSize: typography.body
    },

    sectionHeader: {
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    sectionTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "700"
    },

    seeAllText: {
        color: colors.primary,
        fontSize: typography.caption,
        fontWeight: "700"
    },

    servicesRow: {
        gap: spacing.sm,
        paddingRight: spacing.sm
    },

    smallServiceCard: {
        width: 116,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.sm,
        alignItems: "center",
        ...shadow
    },

    smallServiceIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: colors.chip,
        alignItems: "center",
        justifyContent: "center"
    },

    smallServiceImage: {
        width: 40,
        height: 40,
        resizeMode: "contain"
    },

    smallServiceName: {
        marginTop: spacing.sm,
        color: colors.textPrimary,
        fontSize: 13,
        fontWeight: "700",
        minHeight: 34,
        textAlign: "center"
    },

    smallServiceMeta: {
        marginTop: spacing.xs,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        justifyContent: "center",
    },

    smallServiceMetaText: {
        color: colors.textSecondary,
        fontSize: 11,
        fontWeight: "600"
    },

    bannerRow: {
        marginTop: spacing.lg
    },

    bannerCard: {
        marginRight: spacing.sm,
        borderRadius: radius.lg,
        padding: spacing.lg,
        minHeight: 164,
        justifyContent: "space-between",
        ...shadow
    },

    bannerBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#FFFFFF2A",
        borderRadius: radius.pill,
        paddingHorizontal: spacing.sm,
        paddingVertical: 6
    },

    bannerBadgeText: {
        color: "#fff",
        fontSize: typography.caption,
        fontWeight: "700"
    },

    bannerTitle: {
        marginTop: spacing.md,
        color: "#fff",
        fontSize: typography.h2,
        fontWeight: "800",
        maxWidth: "80%"
    },

    bannerSubtitle: {
        marginTop: spacing.sm,
        color: "#EEF6FF",
        fontSize: typography.body,
        lineHeight: 21,
        maxWidth: "88%"
    },

    dotsRow: {
        marginTop: spacing.md,
        marginBottom: spacing.lg,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.border
    },

    activeDot: {
        width: 22,
        backgroundColor: colors.primary
    },

    popularGrid: {
        marginTop: spacing.sm,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: spacing.md
    },

    popularCard: {
        width: "48%",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.md,
        ...shadow
    },

    popularImage: {
        width: 44,
        height: 44,
        resizeMode: "contain"
    },

    ratingRow: {
        marginTop: spacing.sm,
        flexDirection: "row",
        alignItems: "center",
        gap: 4
    },

    ratingText: {
        color: colors.textPrimary,
        fontSize: typography.caption,
        fontWeight: "700"
    },

    popularName: {
        marginTop: spacing.xs,
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "700",
        minHeight: 40
    },

    infoRow: {
        marginTop: spacing.sm,
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },

    infoText: {
        color: colors.textSecondary,
        fontSize: typography.caption
    },

    priceRow: {
        marginTop: spacing.md
    },

    priceLabel: {
        color: colors.textSecondary,
        fontSize: 12
    },

    priceText: {
        marginTop: 2,
        color: colors.primary,
        fontSize: typography.body,
        fontWeight: "800"
    }
});
