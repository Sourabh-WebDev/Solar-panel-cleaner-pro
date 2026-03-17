import { useEffect } from "react";
import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

export default function SplashScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: "Login" as never }],
            });
        }, 1500);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require("../../../assets/images/splash-icon.png")}
                style={{ flex: 1, width: "100%", height: "100%" }}
                resizeMode="cover"
            />
        </SafeAreaView>
    );
}
