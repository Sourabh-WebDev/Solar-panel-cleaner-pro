import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCustomerProfile, type CustomerProfile } from "../context/CustomerProfileContext";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";

export default function ProfileScreen() {
    const navigation = useNavigation<any>();
    const { profile, updateProfile, resetProfile } = useCustomerProfile();
    const [form, setForm] = useState<CustomerProfile>(profile);
    const [fetchingLocation, setFetchingLocation] = useState(false);

    useEffect(() => {
        setForm(profile);
    }, [profile]);

    const updateField = (key: keyof CustomerProfile, value: string) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const handleSave = () => {
        updateProfile(form);
        Alert.alert("Profile Updated", "Photo, location and customer details have been updated.");
    };

    const handlePickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                "Permission Needed",
                "Gallery access is required to choose a profile photo."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled || !result.assets.length) {
            return;
        }

        const nextProfile = {
            ...form,
            avatarUri: result.assets[0].uri,
        };

        setForm(nextProfile);
        updateProfile(nextProfile);
    };

    const handleUseCurrentLocation = () => {
        const currentNavigator = globalThis.navigator as any;

        if (!currentNavigator?.geolocation?.getCurrentPosition) {
            Alert.alert(
                "Location Unavailable",
                "Current location is not available on this device. You can still enter it manually."
            );
            return;
        }

        setFetchingLocation(true);

        currentNavigator.geolocation.getCurrentPosition(
            (position: any) => {
                const latitude = position.coords.latitude.toFixed(5);
                const longitude = position.coords.longitude.toFixed(5);

                updateField("location", `${latitude}, ${longitude}`);
                setFetchingLocation(false);
            },
            () => {
                setFetchingLocation(false);
                Alert.alert(
                    "Location Permission Needed",
                    "Could not fetch current location. You can still add location manually."
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
            }
        );
    };

    const handleLogout = () => {
        Alert.alert("Logout", "Do you want to logout from this account?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: () => {
                    resetProfile();
                    navigation.getParent()?.reset({
                        index: 0,
                        routes: [{ name: "Login" }],
                    });
                },
            },
        ]);
    };

    const initials = form.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.heroCard}>
                    <Pressable onPress={handlePickImage} style={styles.avatarWrap}>
                        {form.avatarUri ? (
                            <Image source={{ uri: form.avatarUri }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, styles.avatarFallback]}>
                                <Text style={styles.avatarText}>{initials || "CU"}</Text>
                            </View>
                        )}

                        <View style={styles.cameraBadge}>
                            <Ionicons name="camera-outline" size={14} color="#fff" />
                        </View>
                    </Pressable>

                    <View style={styles.heroCopy}>
                        <Text style={styles.name}>{form.fullName}</Text>
                        <Text style={styles.helperText}>
                            Tap the profile photo to change it
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Details</Text>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            value={form.fullName}
                            onChangeText={(value) => updateField("fullName", value)}
                            placeholder="Enter full name"
                            placeholderTextColor={colors.textSecondary}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            value={form.email}
                            onChangeText={(value) => updateField("email", value)}
                            placeholder="Enter email"
                            placeholderTextColor={colors.textSecondary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={[styles.input, styles.readOnlyInput]}>
                            <Text style={styles.readOnlyText}>{form.phone}</Text>
                            <Text style={styles.readOnlyBadge}>Not Editable</Text>
                        </View>
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Current / Manual Location</Text>
                        <TextInput
                            value={form.location}
                            onChangeText={(value) => updateField("location", value)}
                            placeholder="Enter location manually"
                            placeholderTextColor={colors.textSecondary}
                            style={styles.input}
                        />
                        <Pressable
                            style={[styles.secondaryButton, fetchingLocation && styles.secondaryButtonDisabled]}
                            onPress={handleUseCurrentLocation}
                            disabled={fetchingLocation}
                        >
                            <Ionicons name="locate-outline" size={18} color={colors.primary} />
                            <Text style={styles.secondaryButtonText}>
                                {fetchingLocation ? "Fetching Location..." : "Use Current Location"}
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Address</Text>
                        <TextInput
                            value={form.address}
                            onChangeText={(value) => updateField("address", value)}
                            placeholder="Enter address"
                            placeholderTextColor={colors.textSecondary}
                            multiline
                            style={[styles.input, styles.textArea]}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            value={form.city}
                            onChangeText={(value) => updateField("city", value)}
                            placeholder="Enter city"
                            placeholderTextColor={colors.textSecondary}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>State</Text>
                        <TextInput
                            value={form.state}
                            onChangeText={(value) => updateField("state", value)}
                            placeholder="Enter state"
                            placeholderTextColor={colors.textSecondary}
                            style={styles.input}
                        />
                    </View>
                </View>

                <Pressable style={styles.primaryButton} onPress={handleSave}>
                    <Ionicons name="save-outline" size={18} color="#fff" />
                    <Text style={styles.primaryButtonText}>Save Changes</Text>
                </Pressable>

                <Pressable style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={18} color="#D64545" />
                    <Text style={styles.logoutText}>Logout</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: spacing.xl * 2,
        gap: spacing.lg,
    },
    heroCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadow,
    },
    avatarWrap: {
        position: "relative",
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.chip,
    },
    avatarFallback: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
    },
    cameraBadge: {
        position: "absolute",
        right: -2,
        bottom: -2,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        color: "#fff",
        fontSize: typography.h3,
        fontWeight: "800",
    },
    heroCopy: {
        flex: 1,
    },
    name: {
        color: colors.textPrimary,
        fontSize: typography.h2,
        fontWeight: "800",
    },
    helperText: {
        marginTop: 4,
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    section: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadow,
    },
    sectionTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "800",
        marginBottom: spacing.md,
    },
    fieldGroup: {
        marginBottom: spacing.md,
    },
    label: {
        color: colors.textPrimary,
        fontSize: typography.caption,
        fontWeight: "700",
        marginBottom: 8,
    },
    input: {
        minHeight: 52,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: "#FDFEFF",
        paddingHorizontal: spacing.md,
        justifyContent: "center",
        color: colors.textPrimary,
        fontSize: typography.body,
    },
    textArea: {
        minHeight: 96,
        textAlignVertical: "top",
        paddingTop: spacing.md,
    },
    readOnlyInput: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.chip,
    },
    readOnlyText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "600",
    },
    readOnlyBadge: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: "700",
    },
    secondaryButton: {
        marginTop: spacing.sm,
        minHeight: 48,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: "#B9D5FF",
        backgroundColor: "#EDF5FF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    secondaryButtonDisabled: {
        opacity: 0.7,
    },
    secondaryButtonText: {
        color: colors.primary,
        fontSize: typography.caption,
        fontWeight: "800",
    },
    primaryButton: {
        minHeight: 54,
        borderRadius: radius.pill,
        backgroundColor: colors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        ...shadow,
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "800",
    },
    logoutButton: {
        minHeight: 54,
        borderRadius: radius.pill,
        backgroundColor: "#FFF1F1",
        borderWidth: 1,
        borderColor: "#F5CACA",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    logoutText: {
        color: "#D64545",
        fontSize: typography.body,
        fontWeight: "800",
    },
});
