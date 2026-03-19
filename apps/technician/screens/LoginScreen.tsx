import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import { useTechnicianLocation } from "../context/TechnicianLocationContext";
import type { TechnicianRootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<TechnicianRootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
    const [technicianId, setTechnicianId] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { requestPermissionAndStartTracking, isStartingTracking } = useTechnicianLocation();

    const handleSignIn = async () => {
        setErrorMessage(null);

        const started = await requestPermissionAndStartTracking();

        if (started) {
            navigation.replace("MainTabs");
            return;
        }

        setErrorMessage("Location allow karo. Technician app ke liye Android ka default location prompt required hai.");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.eyebrow}>Solar Cleaning Pro</Text>
                <Text style={styles.title}>Technician sign in</Text>
                <Text style={styles.subtitle}>
                    Continue with your technician ID to access assigned jobs, live route tracking, and earnings.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Technician ID</Text>
                <TextInput
                    value={technicianId}
                    onChangeText={setTechnicianId}
                    placeholder="Enter technician ID"
                    placeholderTextColor={colors.textSecondary}
                    style={styles.input}
                    autoCapitalize="characters"
                />

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <Pressable style={styles.button} onPress={handleSignIn} disabled={isStartingTracking}>
                    <Text style={styles.buttonText}>{isStartingTracking ? "Allowing Location..." : "Sign in"}</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.lg,
        justifyContent: "center",
        backgroundColor: colors.background,
    },
    header: {
        marginBottom: spacing.xl,
    },
    eyebrow: {
        color: colors.primary,
        fontSize: typography.caption,
        fontWeight: "700",
        letterSpacing: 1,
        textTransform: "uppercase",
    },
    title: {
        marginTop: spacing.sm,
        color: colors.textPrimary,
        fontSize: 30,
        fontWeight: "900",
    },
    subtitle: {
        marginTop: spacing.sm,
        color: colors.textSecondary,
        fontSize: typography.body,
        lineHeight: 22,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        ...shadow,
    },
    label: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: "700",
    },
    input: {
        marginTop: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.md,
        paddingVertical: 14,
        color: colors.textPrimary,
        fontSize: typography.body,
    },
    button: {
        marginTop: spacing.lg,
        borderRadius: radius.md,
        backgroundColor: colors.primary,
        alignItems: "center",
        paddingVertical: 15,
    },
    buttonText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "700",
    },
    errorText: {
        marginTop: spacing.md,
        color: "#B42318",
        fontSize: typography.caption,
        lineHeight: 18,
    },
});
