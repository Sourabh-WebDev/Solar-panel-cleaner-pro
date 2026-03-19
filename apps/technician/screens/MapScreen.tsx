import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";
import type { TechnicianRootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<TechnicianRootStackParamList, "Map">;

const technicianPoint = { latitude: 28.6465, longitude: 77.3183 };
const customerPoint = { latitude: 28.6524, longitude: 77.3065 };

export default function MapScreen({ navigation, route }: Props) {
    const { job } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 28.6492,
                    longitude: 77.3124,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                }}
            >
                <Marker coordinate={technicianPoint} title="You">
                    <View style={styles.techMarker}>
                        <Ionicons name="car-outline" size={18} color="#fff" />
                    </View>
                </Marker>
                <Marker coordinate={customerPoint} title={job.customer} />
                <Polyline coordinates={[technicianPoint, customerPoint]} strokeColor={colors.primary} strokeWidth={4} />
            </MapView>

            <View style={styles.bottomCard}>
                <Text style={styles.cardTitle}>Route to {job.customer}</Text>
                <Text style={styles.cardSubtitle}>{job.address}</Text>

                <View style={styles.metricRow}>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>ETA</Text>
                        <Text style={styles.metricValue}>12 min</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Distance</Text>
                        <Text style={styles.metricValue}>{job.distance}</Text>
                    </View>
                </View>

                <Pressable
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate("JobProgress", { job: { ...job, status: "In Progress" } })}
                >
                    <Text style={styles.primaryText}>Mark arrived and start work</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    map: {
        flex: 1,
    },
    techMarker: {
        backgroundColor: colors.primary,
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#fff",
    },
    bottomCard: {
        position: "absolute",
        left: spacing.md,
        right: spacing.md,
        bottom: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.sm,
        ...shadow,
    },
    cardTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "800",
    },
    cardSubtitle: {
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    metricRow: {
        flexDirection: "row",
        gap: spacing.sm,
    },
    metricCard: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: radius.md,
        padding: spacing.md,
    },
    metricLabel: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    metricValue: {
        marginTop: 4,
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: "800",
    },
    primaryButton: {
        marginTop: spacing.xs,
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        paddingVertical: 14,
        alignItems: "center",
    },
    primaryText: {
        color: "#fff",
        fontSize: typography.body,
        fontWeight: "700",
    },
});
