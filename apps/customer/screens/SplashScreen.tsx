import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentAuthSession } from "../../../shared/services/auth";
import { RootStackParamList } from "../navigation/types";

export default function SplashScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        let cancelled = false;

        const decideRoute = async () => {
            const session = await getCurrentAuthSession();
            if (cancelled) {
                return;
            }

            if (session.isLoggedIn && session.role === "customer") {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "MainTabs" as never }],
                });
                return;
            }

            navigation.reset({
                index: 0,
                routes: [{ name: "Login" as never }],
            });
        };

        const timer = setTimeout(() => {
            void decideRoute();
        }, 900);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
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
