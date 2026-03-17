import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TechnicianNavigator from "./apps/technician/navigation/TechnicianNavigator";

export default function AppTechnician() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <TechnicianNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
