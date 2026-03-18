import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type CustomerProfile = {
    fullName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    location: string;
    avatarUri: string;
};

type CustomerProfileContextValue = {
    profile: CustomerProfile;
    updateProfile: (nextProfile: CustomerProfile) => void;
    resetProfile: () => void;
};

const defaultProfile: CustomerProfile = {
    fullName: "Anurag Verma",
    email: "anurag@email.com",
    address: "H No. 221, Shanti Vihar",
    city: "Lucknow",
    state: "Uttar Pradesh",
    phone: "+91 98765 43210",
    location: "Lucknow, Uttar Pradesh",
    avatarUri: "https://i.pravatar.cc/100?img=12",
};

const CustomerProfileContext = createContext<CustomerProfileContextValue | undefined>(undefined);

export function CustomerProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState(defaultProfile);

    const value = useMemo(
        () => ({
            profile,
            updateProfile: setProfile,
            resetProfile: () => setProfile(defaultProfile),
        }),
        [profile]
    );

    return (
        <CustomerProfileContext.Provider value={value}>
            {children}
        </CustomerProfileContext.Provider>
    );
}

export function useCustomerProfile() {
    const context = useContext(CustomerProfileContext);

    if (!context) {
        throw new Error("useCustomerProfile must be used within CustomerProfileProvider");
    }

    return context;
}
