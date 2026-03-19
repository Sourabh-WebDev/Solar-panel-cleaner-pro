import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation, type NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { TechnicianRootStackParamList, TechnicianTabParamList } from "./types";
import { TechnicianLocationProvider } from "../context/TechnicianLocationContext";
import { incomingRequests } from "../data/mockData";
import Dashboard from "../screens/Dashboard";
import CancelJobWarningScreen from "../screens/CancelJobWarningScreen";
import EarningsScreen from "../screens/EarningsScreen";
import JobDetailsScreen from "../screens/JobDetailsScreen";
import JobProgressScreen from "../screens/JobProgressScreen";
import JobRequestPopup from "../screens/JobRequestPopup";
import JobsScreen from "../screens/JobsScreen";
import LoginScreen from "../screens/LoginScreen";
import LocationPermissionScreen from "../screens/LocationPermissionScreen";
import MapScreen from "../screens/MapScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SplashScreen from "../screens/SplashScreen";
import { colors, radius, shadow, spacing, typography } from "../../../shared/utils/ui";

const Stack = createNativeStackNavigator<TechnicianRootStackParamList>();
const Tab = createBottomTabNavigator<TechnicianTabParamList>();

function FloatingRequestBubble() {
    const navigation = useNavigation<NavigationProp<TechnicianRootStackParamList>>();
    const request = incomingRequests[0];

    if (!request) {
        return null;
    }

    return (
        <Pressable
            style={styles.floatingBubble}
            onPress={() => navigation.navigate("JobRequestPopup", { job: request })}
        >
            <View style={styles.floatingIcon}>
                <Ionicons name="notifications-outline" size={20} color="#fff" />
            </View>
            <View style={styles.floatingTextWrap}>
                <Text style={styles.floatingTitle}>Request incoming</Text>
                <Text style={styles.floatingSubtitle} numberOfLines={1}>
                    Tap to review like a quick bubble flow
                </Text>
            </View>
        </Pressable>
    );
}

function TechnicianTabs() {
    return (
        <View style={styles.tabsContainer}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: "#0C7BE0",
                    tabBarInactiveTintColor: "#7D8EA0",
                    tabBarIcon: ({ color, size }) => {
                        const icons: Record<keyof TechnicianTabParamList, keyof typeof Ionicons.glyphMap> = {
                            Dashboard: "speedometer-outline",
                            Jobs: "construct-outline",
                            Earnings: "wallet-outline",
                            Profile: "person-outline",
                        };

                        return <Ionicons name={icons[route.name]} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen name="Dashboard" component={Dashboard} />
                <Tab.Screen name="Jobs" component={JobsScreen} />
                <Tab.Screen name="Earnings" component={EarningsScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
            <FloatingRequestBubble />
        </View>
    );
}

export default function TechnicianNavigator() {
    return (
        <TechnicianLocationProvider>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
                <Stack.Screen name="MainTabs" component={TechnicianTabs} />
                <Stack.Screen
                    name="JobRequestPopup"
                    component={JobRequestPopup}
                    options={{
                        presentation: "transparentModal",
                        animation: "fade",
                    }}
                />
                <Stack.Screen
                    name="CancelJobWarning"
                    component={CancelJobWarningScreen}
                    options={{ headerShown: true, title: "Cancel Job" }}
                />
                <Stack.Screen
                    name="JobDetails"
                    component={JobDetailsScreen}
                    options={{ headerShown: true, title: "Job Details" }}
                />
                <Stack.Screen
                    name="Map"
                    component={MapScreen}
                    options={{ headerShown: true, title: "Route Map" }}
                />
                <Stack.Screen
                    name="JobProgress"
                    component={JobProgressScreen}
                    options={{ headerShown: true, title: "Progress" }}
                />
            </Stack.Navigator>
        </TechnicianLocationProvider>
    );
}

const styles = StyleSheet.create({
    tabsContainer: {
        flex: 1,
    },
    floatingBubble: {
        position: "absolute",
        right: spacing.md,
        bottom: 88,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        maxWidth: 240,
        backgroundColor: "#10243E",
        borderRadius: radius.pill,
        paddingVertical: 10,
        paddingHorizontal: 12,
        ...shadow,
    },
    floatingIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    floatingTextWrap: {
        flexShrink: 1,
    },
    floatingTitle: {
        color: "#fff",
        fontSize: typography.caption,
        fontWeight: "800",
    },
    floatingSubtitle: {
        marginTop: 2,
        color: "#C8D6EA",
        fontSize: 11,
    },
});
