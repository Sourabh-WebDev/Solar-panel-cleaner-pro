import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { colors, radius, spacing } from "../utils/ui";

interface TechnicianScreenHeaderProps {
    isOnline: boolean;
    onOnlineChange: (value: boolean) => void;
    todayEarnings: number;
    onNotificationPress: () => void;
    onProfilePress: () => void;
    showNotification?: boolean;
    profileInitials?: string;
    profileAvatarColor?: string;
    profileImageUri?: string;
}

export default function TechnicianScreenHeader({
    isOnline,
    onOnlineChange,
    todayEarnings,
    onNotificationPress,
    onProfilePress,
    showNotification = true,
    profileInitials,
    profileAvatarColor,
    profileImageUri,
}: TechnicianScreenHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.statusRow}>
                <View style={styles.statusIndicator}>
                    <View style={[styles.statusDot, isOnline && styles.statusDotActive]} />
                    <Text style={styles.statusText}>{isOnline ? "Online" : "Offline"}</Text>
                </View>
                <Switch
                    value={isOnline}
                    onValueChange={onOnlineChange}
                    trackColor={{ false: "#E0E5F0", true: "#A8D5BA" }}
                    thumbColor={isOnline ? colors.success : "#AEB8CC"}
                    style={styles.switch}
                />
            </View>

            <View style={styles.earningsGap} />

            <View style={styles.earningsRow}>
                <Ionicons name="wallet-outline" size={16} color={colors.success} />
                <View>
                    <Text style={styles.earningsLabel}>Today</Text>
                    <Text style={styles.earningsValue}>Rs {todayEarnings.toLocaleString("en-IN")}</Text>
                </View>
            </View>

            <View style={styles.rightSection}>
                <Pressable style={[styles.iconButton, showNotification && styles.iconButtonActive]} onPress={onNotificationPress}>
                    <Ionicons name="notifications-outline" size={18} color={colors.textPrimary} />
                    {showNotification ? <View style={styles.notificationDot} /> : null}
                </Pressable>

                <Pressable style={styles.iconButton} onPress={onProfilePress}>
                    {profileImageUri ? (
                        <Image source={{ uri: profileImageUri }} style={styles.profileAvatarImage} />
                    ) : profileInitials ? (
                        <View style={[styles.profileAvatar, profileAvatarColor ? { backgroundColor: profileAvatarColor } : null]}>
                            <Text style={styles.profileInitials}>{profileInitials}</Text>
                        </View>
                    ) : (
                        <Ionicons name="person-circle-outline" size={22} color={colors.primary} />
                    )}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        paddingRight: spacing.xs,
        borderRightWidth: 1,
        borderRightColor: colors.border,
    },
    statusIndicator: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#D7DCE8",
    },
    statusDotActive: {
        backgroundColor: colors.success,
    },
    statusText: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: "700",
    },
    switch: {
        marginRight: spacing.xs,
    },
    earningsGap: {
        width: spacing.xs,
    },
    earningsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        flex: 1,
    },
    earningsLabel: {
        color: colors.textSecondary,
        fontSize: 10,
        fontWeight: "600",
    },
    earningsValue: {
        color: colors.success,
        fontSize: 12,
        fontWeight: "800",
    },
    rightSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        marginLeft: spacing.sm,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: radius.md,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    iconButtonActive: {
        borderColor: colors.primary,
        backgroundColor: "#EAF1FF",
    },
    profileAvatar: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    profileAvatarImage: {
        width: 26,
        height: 26,
        borderRadius: 13,
    },
    profileInitials: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "800",
    },
    notificationDot: {
        position: "absolute",
        top: 4,
        right: 4,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: colors.surface,
    },
});
