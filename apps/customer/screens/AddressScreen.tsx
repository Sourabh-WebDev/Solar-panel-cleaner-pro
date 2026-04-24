import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import { useCustomerBooking } from "../context/CustomerBookingContext";

const addressOptions = [
    "House 14, Raj Nagar Extension, Ghaziabad",
    "B-92, Sector 62, Noida",
    "Flat 803, Vaishali Heights, Ghaziabad",
];

export default function AddressScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { booking, setService, setAddress } = useCustomerBooking();
    const [selectedAddress, setSelectedAddress] = useState(booking.address || addressOptions[0]);
    const service = useMemo(() => route.params?.service ?? booking.service, [route.params?.service, booking.service]);

    useEffect(() => {
        if (service && booking.service?.id !== service.id) {
            setService(service);
        }
    }, [service, booking.service?.id, setService]);

    const handleContinue = () => {
        setAddress(selectedAddress);
        navigation.navigate("DateSlot");
    };

    return (
        <LinearGradient colors={["#F4F7FB", "#E8EEF7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientContainer}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.decorativeBlob1} />
                <View style={styles.decorativeBlob2} />
                <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Selected Service</Text>
                        <Text style={styles.summaryTitle}>{service?.name ?? "Choose service"}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Saved Addresses</Text>

                    {addressOptions.map((address) => {
                        const selected = selectedAddress === address;

                        return (
                            <Pressable
                                key={address}
                                style={[styles.addressCard, selected && styles.selectedCard]}
                                onPress={() => setSelectedAddress(address)}
                            >
                                <Text style={styles.addressTitle}>Service Address</Text>
                                <Text style={styles.addressText}>{address}</Text>
                            </Pressable>
                        );
                    })}

                    <Text style={styles.sectionTitle}>Add Manually</Text>
                    <TextInput
                        value={selectedAddress}
                        onChangeText={setSelectedAddress}
                        placeholder="Enter full address"
                        placeholderTextColor={colors.textSecondary}
                        multiline
                        style={styles.input}
                    />

                    <Pressable style={styles.primaryButton} onPress={handleContinue}>
                        <Text style={styles.primaryButtonText}>Continue to Date & Slot</Text>
                    </Pressable>
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
    content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
    summaryCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...shadow,
    },
    summaryLabel: {
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    summaryTitle: {
        marginTop: 4,
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "800",
    },
    sectionTitle: {
        marginBottom: spacing.sm,
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "800",
    },
    addressCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    selectedCard: {
        borderColor: colors.primary,
        backgroundColor: "#F2F7FF",
    },
    addressTitle: {
        color: colors.textPrimary,
        fontSize: typography.caption,
        fontWeight: "700",
    },
    addressText: {
        marginTop: 6,
        color: colors.textSecondary,
        fontSize: typography.body,
        lineHeight: 22,
    },
    input: {
        minHeight: 92,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        textAlignVertical: "top",
        color: colors.textPrimary,
        fontSize: typography.body,
    },
    primaryButton: {
        marginTop: spacing.lg,
        minHeight: 54,
        borderRadius: radius.pill,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        ...shadow,
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "800",
    },
});
