
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomerNavigator from "./apps/customer/navigation/CustomerNavigator";
import TechnicianNavigator from "./apps/technician/navigation/TechnicianNavigator";

const APP_TYPE = process.env.EXPO_PUBLIC_APP_TYPE;

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                {APP_TYPE === "technician" ? (
                    <TechnicianNavigator />
                ) : (
                    <CustomerNavigator />
                )}
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
