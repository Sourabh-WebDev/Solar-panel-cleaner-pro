import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "../screens/DashboardScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ServicesScreen from "../screens/ServicesScreen";
import SplashScreen from "../screens/SplashScreen";
import { RootStackParamList } from "./types";
import VerifyOTPScreen from "../screens/VerifyOTPScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function CustomerTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#0C7BE0",
                tabBarInactiveTintColor: "#7D8EA0",
                tabBarIcon: ({ color, size }) => {
                    const icons: Record<string, string> = {
                        Dashboard: "home-outline",
                        Services: "construct-outline",
                        Profile: "person-outline",
                    };

                    return (
                        <Ionicons
                            name={icons[route.name] as keyof typeof Ionicons.glyphMap}
                            size={size}
                            color={color}
                        />
                    );
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Services" component={ServicesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default function CustomerNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
            <Stack.Screen name="MainTabs" component={CustomerTabs} />
        </Stack.Navigator>
    );
}
