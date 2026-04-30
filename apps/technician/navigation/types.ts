export type TechnicianJob = {
    id: string;
    customer: string;
    service: string;
    address: string;
    payout: number;
    status: "New Request" | "Accepted" | "In Progress" | "Completed";
    scheduledTime: string;
    distance: string;
    phone: string;
    notes: string;
};

export type TechnicianRootStackParamList = {
    Splash: undefined;
    Login: undefined;
    VerifyOTP: { phone: string; otpRequestId: string; devOtp?: string };
    LocationPermission: undefined;
    MainTabs: undefined;
    JobRequestPopup: { job: TechnicianJob };
    CancelJobWarning: { job: TechnicianJob };
    JobDetails: { job: TechnicianJob };
    Map: { job: TechnicianJob };
    JobProgress: { job: TechnicianJob };
};

export type TechnicianTabParamList = {
    Dashboard: undefined;
    Jobs: undefined;
    Earnings: undefined;
    Profile: undefined;
};
