import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useCustomerBooking } from "../context/CustomerBookingContext";
import { services } from "../../../shared/api/api";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";

export default function ServicesScreen() {
    const navigation = useNavigation<any>();
    const { setService } = useCustomerBooking();

    const handleSelectService = (service: any) => {
        setService(service);
        navigation.navigate("Address", { service });
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.title}>Choose your solar service</Text>
            <Text style={styles.subtitle}>
                Start the booking flow by selecting the service you want today.
            </Text>

            {services.map((service) => (
                <Pressable
                    key={service.id}
                    style={styles.card}
                    onPress={() => handleSelectService(service)}
                >
                    <View style={styles.iconWrap}>
                        <Image source={service.image} style={styles.image} />
                    </View>

                    <View style={styles.copy}>
                        <Text style={styles.name}>{service.name}</Text>
                        <View style={styles.metaRow}>
                            <MaterialCommunityIcons
                                name="clock-outline"
                                size={14}
                                color={colors.textSecondary}
                            />
                            <Text style={styles.metaText}>Fast doorstep service</Text>
                        </View>
                        <Text style={styles.price}>Rs {service.price}</Text>
                    </View>

                    <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color={colors.primary}
                    />
                </Pressable>
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
        padding: spacing.md,
        marginBottom: spacing.md,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        ...shadow,
    },
    iconWrap: {
        width: 62,
        height: 62,
        borderRadius: 18,
        backgroundColor: colors.chip,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: 42,
        height: 42,
        resizeMode: "contain",
    },
    copy: {
        flex: 1,
    },
    name: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "800",
    },
    metaRow: {
        marginTop: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    metaText: {
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    price: {
        marginTop: spacing.sm,
        color: colors.primary,
        fontSize: typography.body,
        fontWeight: "800",
    },
});
