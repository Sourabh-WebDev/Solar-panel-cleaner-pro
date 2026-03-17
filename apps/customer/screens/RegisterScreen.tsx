import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
    const [phone, setPhone] = useState("");
    const [sending, setSending] = useState(false);

    const formTranslateY = useRef(new Animated.Value(0)).current;

    // ⌨ Keyboard animation
    useEffect(() => {
        const showEvent =
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent =
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const showSub = Keyboard.addListener(showEvent, () => {
            Animated.timing(formTranslateY, {
                toValue: -100,
                duration: 250,
                useNativeDriver: true,
            }).start();
        });

        const hideSub = Keyboard.addListener(hideEvent, () => {
            Animated.timing(formTranslateY, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const handleSendOtp = () => {
        if (!phone.trim()) return;

        setSending(true);
        setTimeout(() => {
            setSending(false);
            navigation.navigate("VerifyOTP", { phone, mode: "register" });
        }, 500);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Top Card */}
            <View style={styles.topCard}>
                <Image
                    source={require("../../../assets/images/solar-panel-cleaner-pro-high-resolution-logo-transparent.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Wave */}
            <Svg height="80" width="100%" viewBox="0 0 1440 320" style={styles.wave}>
                <Path
                    fill="#ffffff"
                    d="M0,160L80,154.7C160,149,320,139,480,160C640,181,800,235,960,245.3C1120,256,1280,224,1360,208L1440,192L1440,0L0,0Z"
                />
            </Svg>

            {/* Register Section */}
            <Animated.View
                style={[
                    styles.section,
                    { transform: [{ translateY: formTranslateY }] },
                ]}
            >
                <Text style={styles.title}>Create Account</Text>

                <Text style={styles.subtitle}>
                    Enter your phone number to get started
                </Text>

                {/* Phone Input */}
                <View style={styles.phoneContainer}>
                    <Text style={styles.countryCode}>+91</Text>

                    <TextInput
                        style={styles.phoneInput}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />
                </View>

                {/* Button */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSendOtp}
                    disabled={sending}
                >
                    <LinearGradient
                        colors={["#1DA1F2", "#4B6CFF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>
                            {sending ? "Sending..." : "Send OTP"}
                        </Text>
                        <Ionicons
                            name="arrow-forward"
                            size={18}
                            color="#fff"
                        />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Login Link */}
                <View style={styles.linkRow}>
                    <Text style={styles.muted}>
                        Already have an account?{" "}
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.replace("Login")}
                    >
                        <Text style={styles.link}>Login</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <Text style={styles.footer}>Design by Thewemade</Text>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF2F7",
    },

    topCard: {
        backgroundColor: "#fff",
        alignItems: "center",
        padding: 20,
        elevation: 5,
    },

    logo: {
        width: 120,
        height: 120,
    },

    section: {
        padding: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 6,
    },

    subtitle: {
        color: "#777",
        marginBottom: 20,
    },

    phoneContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 30,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 25,
        backgroundColor: "#fff",
    },

    countryCode: {
        fontWeight: "600",
        marginRight: 10,
    },

    phoneInput: {
        flex: 1,
        fontSize: 16,
    },

    wave: {
        marginTop: -5,
    },

    button: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 30,
    },

    buttonText: {
        color: "#fff",
        fontWeight: "700",
    },

    linkRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },

    link: {
        color: "#2A7DE1",
        fontWeight: "700",
    },

    muted: {
        color: "#777",
    },

    footer: {
        marginTop: "auto",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "700",
        color: "#aaa",
        paddingBottom: 20,
    },
});