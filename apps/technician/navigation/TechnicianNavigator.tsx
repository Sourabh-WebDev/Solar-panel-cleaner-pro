import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Dashboard from "../screens/Dashboard";
import JobsScreen from "../screens/JobsScreen";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RequestsScreen from "../screens/RequestsScreen";
import SplashScreen from "../screens/SplashScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TechnicianTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#0C7BE0",
                tabBarInactiveTintColor: "#7D8EA0",
                tabBarIcon: ({ color, size }) => {
                    const icons: Record<string, string> = {
                        Dashboard: "speedometer-outline",
                        Jobs: "construct-outline",
                        Requests: "notifications-outline",
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
            <Tab.Screen name="Dashboard" component={Dashboard} />
            <Tab.Screen name="Jobs" component={JobsScreen} />
            <Tab.Screen name="Requests" component={RequestsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default function TechnicianNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="MainTabs"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="MainTabs" component={TechnicianTabs} />
        </Stack.Navigator>
    );
}
