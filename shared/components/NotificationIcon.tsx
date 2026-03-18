import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    count?: number;
    onPress?: () => void;
};

export function NotificationIcon({ count = 0, onPress }: Props) {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Ionicons name="notifications-outline" size={24} color="#000" />

            {count > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {count > 9 ? "9+" : count}
                    </Text>
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    badge: {
        position: "absolute",
        top: -4,
        right: -6,
        backgroundColor: "#FF3B30",
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 3,
    },
    badgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
    },
});