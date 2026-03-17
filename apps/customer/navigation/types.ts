export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    VerifyOTP: { phone: string; mode: "login" | "register" };
    MainTabs: undefined;
};
