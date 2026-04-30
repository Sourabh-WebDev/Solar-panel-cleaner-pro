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

type Props = NativeStackScreenProps<RootStackParamList, "VerifyOTP">;

export default function VerifyOTPScreen({ route, navigation }: Props) {
    const { phone, mode } = route.params;

    const [otp, setOtp] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState("");
    const [secondsLeft, setSecondsLeft] = useState(120);

    const formTranslateY = useRef(new Animated.Value(0)).current;
    const otpInputRef = useRef<TextInput>(null);

    // ⏱ Timer
    useEffect(() => {
        if (secondsLeft <= 0) return;

        const timer = setInterval(() => {
            setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [secondsLeft]);

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

    const handleVerify = () => {
        if (!otp.trim()) {
            setError("Enter OTP");
            return;
        }

        setError("");
        setVerifying(true);

        setTimeout(() => {
            setVerifying(false);
            navigation.reset({
                index: 0,
                routes: [{ name: "MainTabs" }],
            });
        }, 600);
    };

    const handleResend = () => {
        setError("");
        setSecondsLeft(120);
    };

    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const seconds = String(secondsLeft % 60).padStart(2, "0");

    const otpDigits = Array.from({ length: 4 }, (_, i) => otp[i] ?? "");

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

            {/* Main Section */}
            <Animated.View
                style={[
                    styles.section,
                    { transform: [{ translateY: formTranslateY }] },
                ]}
            >
                <Text style={styles.title}>
                    {mode === "login" ? "Login OTP" : "Create Account"}
                </Text>

                <Text style={styles.subtitle}>
                    OTP sent to +91 {phone}
                </Text>

                {/* OTP Boxes */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => otpInputRef.current?.focus()}
                >
                    <TextInput
                        ref={otpInputRef}
                        value={otp}
                        onChangeText={(v) =>
                            setOtp(v.replace(/\D/g, "").slice(0, 4))
                        }
                        keyboardType="number-pad"
                        style={styles.hiddenInput}
                    />

                    <View style={styles.otpRow}>
                        {otpDigits.map((digit, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.otpBox,
                                    digit && styles.otpBoxFilled,
                                ]}
                            >
                                <Text style={styles.otpText}>{digit}</Text>
                            </View>
                        ))}
                    </View>
                </TouchableOpacity>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                {/* Button */}
                <TouchableOpacity onPress={handleVerify} disabled={verifying}>
                    <LinearGradient
                        colors={["#1DA1F2", "#4B6CFF"]}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>
                            {verifying ? "Verifying..." : "Verify & Continue"}
                        </Text>
                        <Ionicons
                            name="arrow-forward"
                            size={18}
                            color="#fff"
                        />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Resend */}
                <View style={styles.row}>
                    <Text style={styles.muted}>Didn’t get OTP? </Text>
                    <TouchableOpacity onPress={handleResend}>
                        <Text style={styles.link}>Resend</Text>
                    </TouchableOpacity>
                </View>

                {/* Timer */}
                <View style={styles.timerRow}>
                    <Ionicons name="time-outline" size={16} color="#777" />
                    <Text style={styles.timer}>
                        {minutes}:{seconds}
                    </Text>
                </View>
            </Animated.View>
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

    wave: {
        marginTop: -5,
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

    hiddenInput: {
        position: "absolute",
        opacity: 0,
    },

    otpRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 15,
    },

    otpBox: {
        flex: 1,
        height: 55,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },

    otpBoxFilled: {
        borderColor: "#4B6CFF",
        backgroundColor: "#EEF2FF",
    },

    otpText: {
        fontSize: 20,
        fontWeight: "700",
    },

    button: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 14,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 10,
    },

    buttonText: {
        color: "#fff",
        fontWeight: "700",
    },

    row: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 15,
    },

    muted: {
        color: "#777",
    },

    link: {
        color: "#2A7DE1",
        fontWeight: "700",
    },

    timerRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        gap: 5,
    },

    timer: {
        color: "#777",
    },

    error: {
        color: "red",
        marginBottom: 10,
    },
});