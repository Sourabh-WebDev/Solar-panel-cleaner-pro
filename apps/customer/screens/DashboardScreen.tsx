import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen({ navigation }: any) {
    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <Text>Customer Dashboard</Text>

            <Button
                title="Book Cleaning"
                onPress={() => navigation.navigate("Services")}
            />
        </SafeAreaView>
    );
}
