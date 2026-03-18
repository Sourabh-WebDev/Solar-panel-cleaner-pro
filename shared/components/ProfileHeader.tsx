import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
    name: string;
    subtitle: string;
    image?: string;
};

export function ProfileHeader({ name, subtitle, image }: Props) {
    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    return (
        <View style={styles.container}>
            {image ? (
                <Image source={{ uri: image }} style={styles.avatar} />
            ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                    <Text style={styles.initials}>{initials || "CU"}</Text>
                </View>
            )}

            <View>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {subtitle}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    avatarFallback: {
        backgroundColor: "#0B6DFF",
        alignItems: "center",
        justifyContent: "center",
    },
    initials: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "800",
    },
    name: {
        fontSize: 14,
        fontWeight: "700",
    },
    subtitle: {
        fontSize: 11,
        color: "#7D8EA0",
        maxWidth: 160,
    },
});
