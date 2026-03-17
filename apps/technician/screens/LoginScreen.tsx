import { Button, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <TextInput placeholder="Technician ID" />
            <Button title="Sign In" />
        </SafeAreaView>
    );
}
