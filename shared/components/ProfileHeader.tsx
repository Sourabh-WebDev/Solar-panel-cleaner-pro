import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
    name: string;
    email: string;
    image: string;
};

export function ProfileHeader({ name, email, image }: Props) {
    return (
        <View style={styles.container}>
            <Image source={{ uri: image }} style={styles.avatar} />

            <View>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.email}>{email}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18 // ✅ circle
    },
    name: {
        fontSize: 14,
        fontWeight: "700"
    },
    email: {
        fontSize: 11,
        color: "#7D8EA0"
    }
});