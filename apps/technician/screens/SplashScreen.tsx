import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TechnicianRootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<TechnicianRootStackParamList, "Splash">;

export default function SplashScreen({ navigation }: Props) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("Login");
        }, 1200);

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
