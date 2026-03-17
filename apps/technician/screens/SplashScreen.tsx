import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
    return (
        <SafeAreaView
            style={{ flex: 1 }}
        >
            <ImageBackground
                source={require("../../../assets/images/splash-icon.png")}
                style={{ flex: 1, width: "100%", height: "100%" }}
                resizeMode="cover"
            />
        </SafeAreaView>
    );
}
