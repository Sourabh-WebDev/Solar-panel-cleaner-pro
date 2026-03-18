import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { NotificationIcon } from "@/shared/components/NotificationIcon";
import { ProfileHeader } from "@/shared/components/ProfileHeader";
import DashboardScreen from "../screens/DashboardScreen";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ServicesScreen from "../screens/ServicesScreen";
import SplashScreen from "../screens/SplashScreen";
import VerifyOTPScreen from "../screens/VerifyOTPScreen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

type TabParamList = {
    Dashboard: undefined;
    Services: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function CustomerTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ navigation, route }) => ({
                headerShown: true,

                // ✅ COMMON HEADER LEFT (Notification)
                headerRight: () => (
                    <NotificationIcon
                        count={3}
                        onPress={() => navigation.navigate("Notifications" as never)}
                    />
                ),

                // ✅ COMMON HEADER TITLE (Profile)
                headerTitle: () => (
                    <ProfileHeader
                        name="Anurag Verma"
                        email="anurag@email.com"
                        image="https://i.pravatar.cc/100"
                    />
                ),

                headerTitleAlign: "left",

                // spacing fix
                headerLeftContainerStyle: {
                    paddingRight: 0,
                },

                tabBarActiveTintColor: "#0C7BE0",
                tabBarInactiveTintColor: "#7D8EA0",

                tabBarIcon: ({ color, size }) => {
                    const icons: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
                        Dashboard: "home-outline",
                        Services: "construct-outline",
                        Profile: "person-outline",
                    };

                    return (
                        <Ionicons
                            name={icons[route.name]}
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
