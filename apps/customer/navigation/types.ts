import type { ServiceItem } from "../context/CustomerBookingContext";

export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    VerifyOTP: {
        phone: string;
        mode: "login" | "register";
        otpRequestId: string;
        devOtp?: string;
    };
    MainTabs: undefined;
    Notifications: undefined;
    ServicesList: undefined;
    Address: { service?: ServiceItem };
    DateSlot: undefined;
    ConfirmBooking: undefined;
    SearchingTechnician: undefined;
    TechnicianAssigned: undefined;
    LiveTracking: undefined;
    ServiceCompleted: undefined;
    RatingFeedback: undefined;
};
