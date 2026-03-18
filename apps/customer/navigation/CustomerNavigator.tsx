import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { NotificationIcon } from "@/shared/components/NotificationIcon";
import { ProfileHeader } from "@/shared/components/ProfileHeader";
import { CustomerBookingProvider } from "../context/CustomerBookingContext";
import { CustomerProfileProvider, useCustomerProfile } from "../context/CustomerProfileContext";
import BookingScreen from "../screens/BookingScreen";
import ConfirmBookingScreen from "../screens/ConfirmBookingScreen";
import DashboardScreen from "../screens/DashboardScreen";
import DateSlotScreen from "../screens/DateSlotScreen";
import LiveTrackingScreen from "../screens/LiveTrackingScreen";
import LoginScreen from "../screens/LoginScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RatingFeedbackScreen from "../screens/RatingFeedbackScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SearchingTechnicianScreen from "../screens/SearchingTechnicianScreen";
import AddressScreen from "../screens/AddressScreen";
import ServiceCompletedScreen from "../screens/ServiceCompletedScreen";
import ServicesScreen from "../screens/ServicesScreen";
import SplashScreen from "../screens/SplashScreen";
import TechnicianAssignedScreen from "../screens/TechnicianAssignedScreen";
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
    const { profile } = useCustomerProfile();

    return (
        <Tab.Navigator
            screenOptions={({ navigation, route }) => ({
                headerShown: true,
                headerRight: () => (
                    <NotificationIcon
                        count={3}
                        onPress={() => navigation.navigate("Notifications" as never)}
                    />
                ),
                headerTitle: () => (
                    <ProfileHeader
                        name={profile.fullName}
                        subtitle={profile.location}
                        image={profile.avatarUri}
                    />
                ),
                headerTitleAlign: "left",
                headerLeftContainerStyle: {
                    paddingRight: 0,
                },
                tabBarActiveTintColor: "#0C7BE0",
                tabBarInactiveTintColor: "#7D8EA0",
                tabBarIcon: ({ color, size }) => {
                    const icons: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
                        Dashboard: "home-outline",
                        Services: "calendar-outline",
                        Profile: "person-outline",
                    };

                    return <Ionicons name={icons[route.name]} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen
                name="Services"
                component={BookingScreen}
                options={{
                    title: "Bookings",
                    tabBarLabel: "Bookings",
                }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default function CustomerNavigator() {
    return (
        <CustomerProfileProvider>
            <CustomerBookingProvider>
                <Stack.Navigator initialRouteName="Splash">
                    <Stack.Screen
                        name="Splash"
                        component={SplashScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="VerifyOTP"
                        component={VerifyOTPScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="MainTabs"
                        component={CustomerTabs}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Notifications"
                        component={NotificationsScreen}
                        options={{ title: "Notifications" }}
                    />
                    <Stack.Screen name="ServicesList" component={ServicesScreen} options={{ title: "Select Service" }} />
                    <Stack.Screen name="Address" component={AddressScreen} options={{ title: "Select Address" }} />
                    <Stack.Screen name="DateSlot" component={DateSlotScreen} options={{ title: "Select Date & Slot" }} />
                    <Stack.Screen name="ConfirmBooking" component={ConfirmBookingScreen} options={{ title: "Confirm Booking" }} />
                    <Stack.Screen
                        name="SearchingTechnician"
                        component={SearchingTechnicianScreen}
                        options={{ title: "Searching Technician" }}
                    />
                    <Stack.Screen
                        name="TechnicianAssigned"
                        component={TechnicianAssignedScreen}
                        options={{ title: "Technician Assigned" }}
                    />
                    <Stack.Screen
                        name="LiveTracking"
                        component={LiveTrackingScreen}
                        options={{ title: "Live Tracking on Map" }}
                    />
                    <Stack.Screen
                        name="ServiceCompleted"
                        component={ServiceCompletedScreen}
                        options={{ title: "Service Completed" }}
                    />
                    <Stack.Screen
                        name="RatingFeedback"
                        component={RatingFeedbackScreen}
                        options={{ title: "Rating & Feedback" }}
                    />
                </Stack.Navigator>
            </CustomerBookingProvider>
        </CustomerProfileProvider>
    );
}
