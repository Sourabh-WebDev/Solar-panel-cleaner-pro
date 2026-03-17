import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomerNavigator from "./apps/customer/navigation/CustomerNavigator";

export default function AppCustomer() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <CustomerNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
