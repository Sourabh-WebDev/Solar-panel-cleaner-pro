import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation, type NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Vibration, View } from "react-native";

import { colors, shadow, spacing } from "../../../shared/utils/ui";
import { TechnicianLocationProvider } from "../context/TechnicianLocationContext";
import { incomingRequests } from "../data/mockData";
import CancelJobWarningScreen from "../screens/CancelJobWarningScreen";
import Dashboard from "../screens/Dashboard";
import EarningsScreen from "../screens/EarningsScreen";
import JobDetailsScreen from "../screens/JobDetailsScreen";
import JobProgressScreen from "../screens/JobProgressScreen";
import JobRequestPopup from "../screens/JobRequestPopup";
import JobsScreen from "../screens/JobsScreen";
import LocationPermissionScreen from "../screens/LocationPermissionScreen";
import LoginScreen from "../screens/LoginScreen";
import MapScreen from "../screens/MapScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SplashScreen from "../screens/SplashScreen";
import VerifyOTPScreen from "../screens/VerifyOTPScreen";
import type { TechnicianRootStackParamList, TechnicianTabParamList } from "./types";

const Stack = createNativeStackNavigator<TechnicianRootStackParamList>();
const Tab = createBottomTabNavigator<TechnicianTabParamList>();
const REQUEST_ALERT_SOUND =
    "data:audio/wav;base64,UklGRlQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTAAAAAAAP//AAD//wAA//8AAP//AAD//wAA";

function FloatingRequestBubble() {
    const navigation = useNavigation<NavigationProp<TechnicianRootStackParamList>>();
    const request = incomingRequests[0];
    const shakeX = useRef(new Animated.Value(0)).current;
    const lastRequestId = useRef<string | null>(null);

    useEffect(() => {
        if (!request) {
            return;
        }

        if (lastRequestId.current === request.id) {
            return;
        }

        lastRequestId.current = request.id;
        let player: ReturnType<typeof createAudioPlayer> | null = null;

        const playAlert = async () => {
            try {
                await setAudioModeAsync({
                    playsInSilentMode: true,
                    shouldPlayInBackground: false,
                });
                player = createAudioPlayer({ uri: REQUEST_ALERT_SOUND });
                player.volume = 1;
                player.play();
            } catch {
                Vibration.vibrate(300);
            }
        };

        void playAlert();

        Animated.sequence([
            Animated.timing(shakeX, { toValue: -8, duration: 45, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: 8, duration: 45, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: -6, duration: 45, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: 6, duration: 45, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: 0, duration: 45, useNativeDriver: true }),
        ]).start();

        return () => {
            if (player) {
                player.remove();
            }
        };
    }, [request, shakeX]);

    if (!request) {
        return null;
    }

    return (
        <Animated.View style={[styles.floatingWrap, { transform: [{ translateX: shakeX }] }]}>
            <Pressable
                style={styles.floatingBubble}
                onPress={() => navigation.navigate("JobRequestPopup", { job: request })}
            >
                <View style={styles.floatingIcon}>
                    <Ionicons name="notifications-outline" size={22} color="#fff" />
                </View>
            </Pressable>
        </Animated.View>
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
                <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
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
    floatingWrap: {
        position: "absolute",
        right: spacing.md,
        bottom: 88,
    },
    floatingBubble: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#10243E",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#1D3556",
        ...shadow,
    },
    floatingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
});
