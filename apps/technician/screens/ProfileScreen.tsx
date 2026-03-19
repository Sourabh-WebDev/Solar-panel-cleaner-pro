import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import type { TechnicianRootStackParamList, TechnicianTabParamList } from "../navigation/types";

type Props = CompositeScreenProps<
    BottomTabScreenProps<TechnicianTabParamList, "Profile">,
    NativeStackScreenProps<TechnicianRootStackParamList>
>;

const profileSections = [
    { label: "Technician ID", value: "TECH-204" },
    { label: "Base location", value: "Ghaziabad Hub" },
    { label: "Speciality", value: "Panel wash and maintenance" },
    { label: "Phone", value: "+91 98765 43000" },
];

export default function ProfileScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>RK</Text>
                    </View>
                    <Text style={styles.name}>Rahul Kumar</Text>
                    <Text style={styles.role}>Field Technician</Text>
                </View>

                <View style={styles.card}>
                    {profileSections.map((item) => (
                        <View key={item.label} style={styles.row}>
                            <Text style={styles.label}>{item.label}</Text>
                            <Text style={styles.value}>{item.value}</Text>
                        </View>
                    ))}
                </View>

                <Pressable style={styles.button} onPress={() => navigation.replace("Login")}>
                    <Text style={styles.buttonText}>Log out</Text>
                </Pressable>
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
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadow,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        color: "#fff",
        fontSize: typography.h2,
        fontWeight: "900",
    },
    name: {
        marginTop: spacing.sm,
        color: colors.textPrimary,
        fontSize: typography.h2,
        fontWeight: "800",
    },
    role: {
        marginTop: 4,
        color: colors.textSecondary,
        fontSize: typography.body,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadow,
    },
    row: {
        padding: spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
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
    button: {
        backgroundColor: "#10243E",
        borderRadius: radius.md,
        paddingVertical: 15,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "700",
    },
});
