import { Ionicons } from "@expo/vector-icons";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
    Alert,
    Image,
    Linking,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { technicianStats } from "../../../shared/api/api";
import TechnicianScreenHeader from "../../../shared/components/TechnicianScreenHeader";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import { incomingRequests } from "../data/mockData";
import type { TechnicianRootStackParamList, TechnicianTabParamList } from "../navigation/types";

type Props = CompositeScreenProps<
    BottomTabScreenProps<TechnicianTabParamList, "Profile">,
    NativeStackScreenProps<TechnicianRootStackParamList>
>;

const fallbackProfile = {
    technicianId: "TECH-204",
    baseLocation: "Ghaziabad Hub",
    homeAddress: "Flat 302, Shanti Residency",
    speciality: "Panel wash and maintenance",
    primaryPhone: "+91 98765 43000",
    secondaryPhone: "+91 98110 22011",
    email: "rahul.kumar@solarpro.in",
};

const localityOptions = ["Ghaziabad Hub", "Indirapuram", "Vaishali", "Raj Nagar", "Noida Extension"];

const avatarOptions = [
    { key: "rk", initials: "RK", color: "#1B3A66", label: "Classic Blue" },
    { key: "sp", initials: "SP", color: "#194E45", label: "Forest Green" },
    { key: "tp", initials: "TP", color: "#6A2C70", label: "Berry" },
    { key: "sc", initials: "SC", color: "#8A4B08", label: "Amber" },
];

export default function ProfileScreen({ navigation }: Props) {
    const [isOnline, setIsOnline] = useState(true);
    const featuredRequest = incomingRequests[0];
    const [selectedAvatarKey, setSelectedAvatarKey] = useState(avatarOptions[0].key);
    const selectedAvatar = avatarOptions.find((avatar) => avatar.key === selectedAvatarKey) ?? avatarOptions[0];
    const [selectedAvatarUri, setSelectedAvatarUri] = useState<string | null>(null);
    const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isLocalityModalVisible, setIsLocalityModalVisible] = useState(false);
    const [isDocsModalVisible, setIsDocsModalVisible] = useState(false);
    const [isKycSubmitted, setIsKycSubmitted] = useState(false);
    const [kycDocs, setKycDocs] = useState<{
        idProof: string | null;
        addressProof: string | null;
        selfie: string | null;
    }>({
        idProof: null,
        addressProof: null,
        selfie: null,
    });
    const [profile, setProfile] = useState(fallbackProfile);
    const [draftProfile, setDraftProfile] = useState(profile);

    const safeValue = (value: string, fallback: string) => {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : fallback;
    };

    const profileSections = [
        { key: "id", label: "Technician ID", value: safeValue(profile.technicianId, fallbackProfile.technicianId) },
        { key: "base", label: "Locality", value: safeValue(profile.baseLocation, fallbackProfile.baseLocation) },
        { key: "homeAddress", label: "Home address", value: safeValue(profile.homeAddress, fallbackProfile.homeAddress) },
        { key: "primaryPhone", label: "Primary phone (registered)", value: safeValue(profile.primaryPhone, fallbackProfile.primaryPhone) },
        { key: "secondaryPhone", label: "Secondary phone", value: safeValue(profile.secondaryPhone, fallbackProfile.secondaryPhone) },
        { key: "email", label: "Email", value: safeValue(profile.email, fallbackProfile.email) },
        { key: "speciality", label: "Speciality", value: safeValue(profile.speciality, fallbackProfile.speciality) },
    ] as const;

    const openMapsForBase = async () => {
        const locationQuery = `${safeValue(profile.baseLocation, fallbackProfile.baseLocation)} ${safeValue(profile.homeAddress, fallbackProfile.homeAddress)}`;
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`;
        const canOpen = await Linking.canOpenURL(mapUrl);
        if (canOpen) {
            await Linking.openURL(mapUrl);
            return;
        }
        Alert.alert("Map unavailable", "Could not open map right now.");
    };

    const callPhone = async () => {
        const preferredPhone = safeValue(profile.secondaryPhone, fallbackProfile.secondaryPhone);
        const phoneUrl = `tel:${preferredPhone.replace(/\s+/g, "")}`;
        const canOpen = await Linking.canOpenURL(phoneUrl);
        if (canOpen) {
            await Linking.openURL(phoneUrl);
            return;
        }
        Alert.alert("Call unavailable", "Could not launch dialer on this device.");
    };

    const openEditProfile = () => {
        setDraftProfile(profile);
        setIsEditModalVisible(true);
    };

    const saveProfile = () => {
        setProfile({
            technicianId: safeValue(draftProfile.technicianId, fallbackProfile.technicianId),
            baseLocation: safeValue(draftProfile.baseLocation, fallbackProfile.baseLocation),
            homeAddress: safeValue(draftProfile.homeAddress, fallbackProfile.homeAddress),
            speciality: safeValue(draftProfile.speciality, fallbackProfile.speciality),
            primaryPhone: safeValue(profile.primaryPhone, fallbackProfile.primaryPhone),
            secondaryPhone: safeValue(draftProfile.secondaryPhone, fallbackProfile.secondaryPhone),
            email: safeValue(draftProfile.email, fallbackProfile.email),
        });
        setIsEditModalVisible(false);
    };

    const docsReady = Boolean(kycDocs.idProof && kycDocs.addressProof && kycDocs.selfie);

    const pickDocumentFile = async (
        docKey: "idProof" | "addressProof" | "selfie",
        source: "camera" | "gallery"
    ) => {
        if (source === "camera") {
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            if (!cameraPermission.granted) {
                Alert.alert("Permission required", "Please allow camera access to upload document.");
                return;
            }

            const cameraResult = await ImagePicker.launchCameraAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!cameraResult.canceled && cameraResult.assets.length > 0) {
                setKycDocs((current) => ({ ...current, [docKey]: cameraResult.assets[0].uri }));
                setIsKycSubmitted(false);
            }
            return;
        }

        const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!mediaPermission.granted) {
            Alert.alert("Permission required", "Please allow gallery access to upload document.");
            return;
        }

        const galleryResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!galleryResult.canceled && galleryResult.assets.length > 0) {
            setKycDocs((current) => ({ ...current, [docKey]: galleryResult.assets[0].uri }));
            setIsKycSubmitted(false);
        }
    };

    const openDocumentUploadOptions = (
        docKey: "idProof" | "addressProof" | "selfie",
        title: string
    ) => {
        Alert.alert(title, "Choose upload source", [
            { text: "Camera", onPress: () => void pickDocumentFile(docKey, "camera") },
            { text: "Gallery", onPress: () => void pickDocumentFile(docKey, "gallery") },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    const pickAvatarFromGallery = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission required", "Please allow gallery access to choose profile image.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets.length > 0) {
            setSelectedAvatarUri(result.assets[0].uri);
        }
    };

    const openAvatarActions = () => {
        Alert.alert("Profile photo", "Choose avatar option", [
            { text: "Gallery", onPress: () => void pickAvatarFromGallery() },
            { text: "Avatar styles", onPress: () => setIsAvatarModalVisible(true) },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    const onDetailPress = (key: (typeof profileSections)[number]["key"]) => {
        if (key === "id") {
            Alert.alert("Technician ID", profile.technicianId);
            return;
        }

        if (key === "base") {
            openEditProfile();
            return;
        }

        if (key === "homeAddress") {
            openEditProfile();
            return;
        }

        if (key === "primaryPhone") {
            Alert.alert("Primary number", "Primary registered number cannot be changed.");
            return;
        }

        if (key === "secondaryPhone") {
            openEditProfile();
            return;
        }

        if (key === "email") {
            openEditProfile();
            return;
        }

        openEditProfile();
    };

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
                    profileInitials={selectedAvatar.initials}
                    profileAvatarColor={selectedAvatar.color}
                    profileImageUri={selectedAvatarUri ?? undefined}
                />
            ) : (
                <TechnicianScreenHeader
                    isOnline={isOnline}
                    onOnlineChange={setIsOnline}
                    todayEarnings={technicianStats.earnings}
                    onNotificationPress={() => { }}
                    onProfilePress={() => navigation.navigate("Profile")}
                    showNotification={false}
                    profileInitials={selectedAvatar.initials}
                    profileAvatarColor={selectedAvatar.color}
                    profileImageUri={selectedAvatarUri ?? undefined}
                />
            )}
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <View style={styles.heroTopRow}>
                        <Pressable
                            style={[styles.avatar, { backgroundColor: selectedAvatar.color }]}
                            onPress={openAvatarActions}
                        >
                            {selectedAvatarUri ? (
                                <Image source={{ uri: selectedAvatarUri }} style={styles.avatarImage} />
                            ) : (
                                <Text style={styles.avatarText}>{selectedAvatar.initials}</Text>
                            )}
                            <View style={styles.avatarEditDot}>
                                <Ionicons name="camera-outline" size={12} color="#fff" />
                            </View>
                        </Pressable>

                        <View style={styles.heroIdentity}>
                            <Text style={styles.name}>Rahul Kumar</Text>
                            <Text style={styles.role}>Field Technician</Text>
                            <View style={styles.idPill}>
                                <Ionicons name="card-outline" size={13} color="#C8D5E8" />
                                <Text style={styles.idText}>Technician ID: TECH-204</Text>
                            </View>
                        </View>

                        <View style={[styles.statusChip, isOnline && styles.statusChipOnline]}>
                            <View style={[styles.statusDot, isOnline && styles.statusDotOnline]} />
                            <Text style={[styles.statusChipText, isOnline && styles.statusChipTextOnline]}>
                                {isOnline ? "Online" : "Offline"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.performanceRow}>
                        <View style={styles.performanceCard}>
                            <View style={styles.performanceCardTop}>
                                <View style={styles.performanceIconWrap}>
                                    <Ionicons name="checkmark-done-outline" size={14} color="#fff" />
                                </View>
                                <Text style={styles.performanceLabel}>Accepted</Text>
                            </View>
                            <Text style={styles.performanceValue}>{technicianStats.acceptedJobs}</Text>
                        </View>
                        <View style={styles.performanceCard}>
                            <View style={styles.performanceCardTop}>
                                <View style={styles.performanceIconWrap}>
                                    <Ionicons name="trending-up-outline" size={14} color="#fff" />
                                </View>
                                <Text style={styles.performanceLabel}>Completion</Text>
                            </View>
                            <Text style={styles.performanceValue}>{technicianStats.completionRate}%</Text>
                        </View>
                        <View style={styles.performanceCard}>
                            <View style={styles.performanceCardTop}>
                                <View style={styles.performanceIconWrap}>
                                    <Ionicons name="wallet-outline" size={14} color="#fff" />
                                </View>
                                <Text style={styles.performanceLabel}>This Month</Text>
                            </View>
                            <Text style={styles.performanceValue}>Rs {technicianStats.earnings.toLocaleString("en-IN")}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Professional details</Text>
                    {profileSections.map((item) => (
                        <Pressable key={item.label} style={styles.row} onPress={() => onDetailPress(item.key)}>
                            <View style={styles.rowTextWrap}>
                                <Text style={styles.label}>{item.label}</Text>
                                <Text style={styles.value}>{item.value}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                        </Pressable>
                    ))}
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Quick actions</Text>
                    <Pressable style={styles.actionRow} onPress={() => setIsDocsModalVisible(true)}>
                        <View style={styles.actionIconWrap}>
                            <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
                        </View>
                        <View style={styles.rowTextWrap}>
                            <Text style={styles.actionTitle}>Documents and verification</Text>
                            <Text style={styles.actionSubtitle}>Manage KYC and compliance details</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                    </Pressable>
                    <Pressable style={styles.actionRow} onPress={() => void callPhone()}>
                        <View style={styles.actionIconWrap}>
                            <Ionicons name="headset-outline" size={18} color={colors.primary} />
                        </View>
                        <View style={styles.rowTextWrap}>
                            <Text style={styles.actionTitle}>Support and help</Text>
                            <Text style={styles.actionSubtitle}>Get quick help from operations team</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                    </Pressable>
                </View>

                <Pressable style={styles.button} onPress={() => navigation.replace("Login")}>
                    <Ionicons name="log-out-outline" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Log out</Text>
                </Pressable>

                <Modal visible={isEditModalVisible} animationType="slide" transparent onRequestClose={() => setIsEditModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalCard}>
                            <Text style={styles.modalTitle}>Edit profile details</Text>

                            <Text style={styles.inputLabel}>Base location</Text>
                            <Pressable style={styles.inputPicker} onPress={() => setIsLocalityModalVisible(true)}>
                                <Text style={styles.inputPickerText}>{safeValue(draftProfile.baseLocation, fallbackProfile.baseLocation)}</Text>
                                <Ionicons name="map-outline" size={16} color={colors.primary} />
                            </Pressable>
                            <Text style={styles.inputHint}>Locality can only be chosen from map-based options.</Text>

                            <Text style={styles.inputLabel}>Home address</Text>
                            <TextInput
                                value={draftProfile.homeAddress}
                                onChangeText={(value) => setDraftProfile((current) => ({ ...current, homeAddress: value }))}
                                style={styles.input}
                                placeholder="Enter home address manually"
                                placeholderTextColor={colors.textSecondary}
                            />

                            <Text style={styles.inputLabel}>Speciality</Text>
                            <TextInput
                                value={draftProfile.speciality}
                                onChangeText={(value) => setDraftProfile((current) => ({ ...current, speciality: value }))}
                                style={styles.input}
                                placeholder="Enter speciality"
                                placeholderTextColor={colors.textSecondary}
                            />

                            <Text style={styles.inputLabel}>Primary phone (registered)</Text>
                            <TextInput
                                value={safeValue(profile.primaryPhone, fallbackProfile.primaryPhone)}
                                style={styles.input}
                                placeholder="Primary registered phone"
                                placeholderTextColor={colors.textSecondary}
                                editable={false}
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.inputLabel}>Secondary phone</Text>
                            <TextInput
                                value={draftProfile.secondaryPhone}
                                onChangeText={(value) => setDraftProfile((current) => ({ ...current, secondaryPhone: value }))}
                                style={styles.input}
                                placeholder="Enter secondary phone"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                value={draftProfile.email}
                                onChangeText={(value) => setDraftProfile((current) => ({ ...current, email: value }))}
                                style={styles.input}
                                placeholder="Enter email"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <View style={styles.modalActions}>
                                <Pressable style={styles.modalGhostButton} onPress={() => setIsEditModalVisible(false)}>
                                    <Text style={styles.modalGhostText}>Cancel</Text>
                                </Pressable>
                                <Pressable style={styles.modalPrimaryButton} onPress={saveProfile}>
                                    <Text style={styles.modalPrimaryText}>Save</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal visible={isDocsModalVisible} animationType="fade" transparent onRequestClose={() => setIsDocsModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.docsModalCard}>
                            <View style={styles.docsHeaderRow}>
                                <View style={styles.docsIconWrap}>
                                    <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
                                </View>
                                <View style={styles.rowTextWrap}>
                                    <Text style={styles.modalTitle}>Documents and verification</Text>
                                    <Text style={styles.modalHint}>Complete profile verification to keep receiving jobs.</Text>
                                </View>
                            </View>

                            <View style={[styles.docsStatusPill, isKycSubmitted && styles.docsStatusPillDone]}>
                                <Text style={[styles.docsStatusText, isKycSubmitted && styles.docsStatusTextDone]}>
                                    {isKycSubmitted ? "Submitted for review" : "Pending submission"}
                                </Text>
                            </View>

                            <View style={styles.docsChecklistCard}>
                                <Pressable
                                    style={styles.docsChecklistRow}
                                    onPress={() => openDocumentUploadOptions("idProof", "Upload Government ID proof")}
                                >
                                    <Ionicons
                                        name={kycDocs.idProof ? "checkmark-circle" : "ellipse-outline"}
                                        size={16}
                                        color={kycDocs.idProof ? colors.success : colors.textSecondary}
                                    />
                                    <View style={styles.rowTextWrap}>
                                        <Text style={styles.docsChecklistText}>Government ID proof</Text>
                                        <Text style={styles.docsChecklistMeta}>
                                            {kycDocs.idProof ? "Uploaded" : "Tap to upload"}
                                        </Text>
                                    </View>
                                    <Ionicons name="cloud-upload-outline" size={16} color={colors.primary} />
                                </Pressable>
                                <Pressable
                                    style={styles.docsChecklistRow}
                                    onPress={() => openDocumentUploadOptions("addressProof", "Upload Address proof")}
                                >
                                    <Ionicons
                                        name={kycDocs.addressProof ? "checkmark-circle" : "ellipse-outline"}
                                        size={16}
                                        color={kycDocs.addressProof ? colors.success : colors.textSecondary}
                                    />
                                    <View style={styles.rowTextWrap}>
                                        <Text style={styles.docsChecklistText}>Address proof</Text>
                                        <Text style={styles.docsChecklistMeta}>
                                            {kycDocs.addressProof ? "Uploaded" : "Tap to upload"}
                                        </Text>
                                    </View>
                                    <Ionicons name="cloud-upload-outline" size={16} color={colors.primary} />
                                </Pressable>
                                <Pressable
                                    style={styles.docsChecklistRow}
                                    onPress={() => openDocumentUploadOptions("selfie", "Upload Selfie for verification")}
                                >
                                    <Ionicons
                                        name={kycDocs.selfie ? "checkmark-circle" : "ellipse-outline"}
                                        size={16}
                                        color={kycDocs.selfie ? colors.success : colors.textSecondary}
                                    />
                                    <View style={styles.rowTextWrap}>
                                        <Text style={styles.docsChecklistText}>Recent selfie for verification</Text>
                                        <Text style={styles.docsChecklistMeta}>
                                            {kycDocs.selfie ? "Uploaded" : "Tap to upload"}
                                        </Text>
                                    </View>
                                    <Ionicons name="cloud-upload-outline" size={16} color={colors.primary} />
                                </Pressable>
                            </View>

                            <View style={styles.modalActions}>
                                <Pressable style={styles.modalGhostButton} onPress={() => setIsDocsModalVisible(false)}>
                                    <Text style={styles.modalGhostText}>Close</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.modalPrimaryButton}
                                    onPress={() => {
                                        if (!docsReady) {
                                            Alert.alert("Upload required", "Please upload all required documents before submitting.");
                                            return;
                                        }
                                        setIsKycSubmitted(true);
                                        Alert.alert("Submitted", "Your KYC documents were submitted successfully.");
                                    }}
                                >
                                    <Text style={styles.modalPrimaryText}>
                                        {isKycSubmitted ? "Resubmit" : docsReady ? "Submit now" : "Upload required"}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal visible={isAvatarModalVisible} animationType="fade" transparent onRequestClose={() => setIsAvatarModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalCard}>
                            <Text style={styles.modalTitle}>Select profile avatar</Text>
                            <View style={styles.avatarOptionGrid}>
                                {avatarOptions.map((option) => {
                                    const isSelected = option.key === selectedAvatarKey;
                                    return (
                                        <Pressable
                                            key={option.key}
                                            style={[styles.avatarOption, isSelected && styles.avatarOptionSelected]}
                                            onPress={() => {
                                                setSelectedAvatarKey(option.key);
                                                setSelectedAvatarUri(null);
                                            }}
                                        >
                                            <View style={[styles.avatarOptionCircle, { backgroundColor: option.color }]}>
                                                <Text style={styles.avatarOptionInitials}>{option.initials}</Text>
                                            </View>
                                            <Text style={styles.avatarOptionLabel}>{option.label}</Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                            <Pressable style={styles.modalPrimaryStandaloneButton} onPress={() => setIsAvatarModalVisible(false)}>
                                <Text style={styles.modalPrimaryText}>Done</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                <Modal visible={isLocalityModalVisible} animationType="fade" transparent onRequestClose={() => setIsLocalityModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.localityModalCard}>
                            <Text style={styles.modalTitle}>Select locality from map</Text>
                            <Text style={styles.modalHint}>Choose one locality option, then use map pin if needed.</Text>

                            <View style={styles.localityListCard}>
                                {localityOptions.map((locality) => {
                                    const isSelected = locality === draftProfile.baseLocation;
                                    return (
                                        <Pressable
                                            key={locality}
                                            style={[styles.localityRow, isSelected && styles.localityRowSelected]}
                                            onPress={() => {
                                                setDraftProfile((current) => ({ ...current, baseLocation: locality }));
                                                setIsLocalityModalVisible(false);
                                            }}
                                        >
                                            <Ionicons
                                                name={isSelected ? "location" : "location-outline"}
                                                size={16}
                                                color={colors.primary}
                                            />
                                            <Text style={styles.localityText}>{locality}</Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            <View style={styles.modalActions}>
                                <Pressable style={styles.modalGhostButton} onPress={() => setIsLocalityModalVisible(false)}>
                                    <Text style={styles.modalGhostText}>Close</Text>
                                </Pressable>
                                <Pressable style={styles.mapPinButton} onPress={() => void openMapsForBase()}>
                                    <Ionicons name="location" size={16} color="#fff" />
                                    <Text style={styles.mapPinButtonText}>Open map</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
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
    hero: {
        backgroundColor: "#10243E",
        borderRadius: radius.lg,
        padding: spacing.xl,
        gap: spacing.md,
        ...shadow,
    },
    heroTopRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: spacing.sm,
    },
    avatar: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: "#FFFFFF26",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    avatarEditDot: {
        position: "absolute",
        right: -2,
        bottom: -2,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#fff",
    },
    avatarText: {
        color: "#fff",
        fontSize: typography.h2,
        fontWeight: "900",
    },
    avatarImage: {
        width: "100%",
        height: "100%",
        borderRadius: 38,
    },
    heroIdentity: {
        flex: 1,
    },
    name: {
        color: "#fff",
        fontSize: typography.h2,
        fontWeight: "800",
    },
    role: {
        marginTop: 4,
        color: "#C8D5E8",
        fontSize: typography.body,
    },
    idText: {
        color: "#C8D5E8",
        fontSize: typography.smallTitle,
        fontWeight: "600",
    },
    idPill: {
        marginTop: spacing.xs,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#FFFFFF12",
        borderRadius: radius.pill,
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
    },
    statusChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#FFFFFF18",
        borderRadius: radius.pill,
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
    },
    statusChipOnline: {
        backgroundColor: "#D9F5E6",
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#F04438",
    },
    statusDotOnline: {
        backgroundColor: colors.success,
    },
    statusChipText: {
        color: "#FFD5D2",
        fontSize: typography.caption,
        fontWeight: "800",
    },
    statusChipTextOnline: {
        color: "#085D3A",
    },
    performanceRow: {
        marginTop: spacing.sm,
        flexDirection: "row",
        gap: spacing.sm,
    },
    performanceCard: {
        flex: 1,
        backgroundColor: "#FFFFFF12",
        borderWidth: 1,
        borderColor: "#FFFFFF1A",
        borderRadius: radius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs,
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    performanceCardTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    performanceIconWrap: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#FFFFFF22",
        alignItems: "center",
        justifyContent: "center",
    },
    performanceValue: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "800",
    },
    performanceLabel: {
        color: "#C8D5E8",
        fontSize: 11,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: spacing.xs,
        ...shadow,
    },
    sectionTitle: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "800",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    row: {
        padding: spacing.md,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    rowTextWrap: {
        flex: 1,
    },
    label: {
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    value: {
        marginTop: 4,
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "700",
    },
    actionRow: {
        padding: spacing.md,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    actionIconWrap: {
        width: 34,
        height: 34,
        borderRadius: radius.md,
        backgroundColor: colors.chip,
        alignItems: "center",
        justifyContent: "center",
    },
    actionTitle: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "700",
    },
    actionSubtitle: {
        marginTop: 2,
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "#00000066",
        justifyContent: "center",
        padding: spacing.lg,
    },
    modalCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        gap: spacing.sm,
    },
    docsModalCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        gap: spacing.md,
    },
    docsHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    docsIconWrap: {
        width: 38,
        height: 38,
        borderRadius: radius.md,
        backgroundColor: colors.chip,
        alignItems: "center",
        justifyContent: "center",
    },
    docsStatusPill: {
        alignSelf: "flex-start",
        backgroundColor: "#FFF3F1",
        borderRadius: radius.pill,
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
    },
    docsStatusPillDone: {
        backgroundColor: "#EAF9EF",
    },
    docsStatusText: {
        color: "#B42318",
        fontSize: typography.caption,
        fontWeight: "700",
    },
    docsStatusTextDone: {
        color: colors.success,
    },
    docsChecklistCard: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.sm,
        gap: spacing.sm,
    },
    docsChecklistRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
    },
    docsChecklistText: {
        color: colors.textPrimary,
        fontSize: typography.caption,
        fontWeight: "600",
    },
    docsChecklistMeta: {
        color: colors.textSecondary,
        fontSize: 11,
        marginTop: 2,
    },
    modalTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "800",
    },
    modalHint: {
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    inputLabel: {
        color: colors.textSecondary,
        fontSize: typography.caption,
        marginTop: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.sm,
        paddingVertical: 10,
        color: colors.textPrimary,
        fontSize: typography.body,
    },
    inputPicker: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.sm,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    inputPickerText: {
        color: colors.textPrimary,
        fontSize: typography.body,
    },
    inputHint: {
        color: colors.textSecondary,
        fontSize: 11,
        marginTop: -4,
    },
    modalActions: {
        flexDirection: "row",
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    modalGhostButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingVertical: 12,
        alignItems: "center",
    },
    modalGhostText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "700",
    },
    modalPrimaryButton: {
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        paddingVertical: 12,
        alignItems: "center",
    },
    modalPrimaryStandaloneButton: {
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: spacing.sm,
    },
    modalPrimaryText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "700",
    },
    avatarOptionGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.sm,
        marginTop: spacing.xs,
    },
    avatarOption: {
        width: "47%",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs,
        alignItems: "center",
        gap: 6,
    },
    avatarOptionSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.chip,
    },
    avatarOptionCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarOptionInitials: {
        color: "#fff",
        fontSize: typography.caption,
        fontWeight: "800",
    },
    avatarOptionLabel: {
        color: colors.textPrimary,
        fontSize: 11,
        fontWeight: "600",
    },
    localityRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        paddingVertical: 11,
        paddingHorizontal: spacing.sm,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    localityRowSelected: {
        backgroundColor: colors.chip,
    },
    localityText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "600",
    },
    localityModalCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        gap: spacing.sm,
    },
    localityListCard: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        overflow: "hidden",
    },
    mapPinButton: {
        flex: 1,
        borderRadius: radius.md,
        backgroundColor: colors.primary,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 6,
    },
    mapPinButtonText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "700",
    },
    button: {
        backgroundColor: "#B42318",
        borderRadius: radius.md,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.xs,
    },
    buttonText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "700",
    },
});
