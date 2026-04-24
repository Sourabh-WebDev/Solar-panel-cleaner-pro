import Button from "@/shared/components/Button";
import { colors, radius, spacing, typography } from "@/shared/utils/ui";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    return (
        <LinearGradient colors={["#F4F7FB", "#E8EEF7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientContainer}>
            <SafeAreaView style={styles.container}>
                {/* Decorative background elements */}
                <View style={styles.decorativeBlob1} />
                <View style={styles.decorativeBlob2} />

                <View style={styles.content}>
                    <View style={styles.heroSection}>
                        <Text style={styles.welcomeText}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Ready to book a service?</Text>
                    </View>

                    <View style={styles.ctaCard}>
                        <Text style={styles.ctaTitle}>Book a Solar Panel Cleaning</Text>
                        <Text style={styles.ctaDescription}>
                            Professional cleaning to maximize your solar panel efficiency
                        </Text>
                        <Button>Book Service</Button>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    container: {
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
    content: {
        flex: 1,
        padding: spacing.lg,
        justifyContent: "flex-start",
        gap: spacing.lg,
        zIndex: 1,
    },
    heroSection: {
        gap: spacing.sm,
    },
    welcomeText: {
        fontSize: typography.h1,
        fontWeight: "900",
        color: colors.textPrimary,
        lineHeight: 36,
    },
    subtitle: {
        fontSize: typography.body,
        color: colors.textSecondary,
        fontWeight: "500",
    },
    ctaCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        gap: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: "#0F23401A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 14,
        elevation: 3,
    },
    ctaTitle: {
        fontSize: typography.h3,
        fontWeight: "700",
        color: colors.textPrimary,
    },
    ctaDescription: {
        fontSize: typography.body,
        color: colors.textSecondary,
        lineHeight: 20,
    },
});