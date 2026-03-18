import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type ServiceItem = {
    id: number;
    name: string;
    image: any;
    price: number;
};

export type BookingStage =
    | "select-service"
    | "select-address"
    | "select-slot"
    | "confirm-booking"
    | "searching-technician"
    | "technician-assigned"
    | "live-tracking"
    | "service-completed"
    | "rating-feedback";

export type CustomerBooking = {
    service: ServiceItem | null;
    address: string;
    date: string;
    slot: string;
    stage: BookingStage;
    technicianName: string;
    technicianPhone: string;
    eta: string;
    rating: number;
    feedback: string;
};

type CustomerBookingContextValue = {
    booking: CustomerBooking;
    setService: (service: ServiceItem) => void;
    setAddress: (address: string) => void;
    setSchedule: (date: string, slot: string) => void;
    setStage: (stage: BookingStage) => void;
    setFeedback: (rating: number, feedback: string) => void;
    resetBooking: () => void;
};

const initialBooking: CustomerBooking = {
    service: null,
    address: "",
    date: "",
    slot: "",
    stage: "select-service",
    technicianName: "Rahul Kumar",
    technicianPhone: "+91 98765 12000",
    eta: "18 mins away",
    rating: 0,
    feedback: "",
};

const CustomerBookingContext = createContext<CustomerBookingContextValue | undefined>(undefined);

export function CustomerBookingProvider({ children }: { children: ReactNode }) {
    const [booking, setBooking] = useState<CustomerBooking>(initialBooking);

    const value = useMemo(
        () => ({
            booking,
            setService: (service: ServiceItem) =>
                setBooking((current) => ({
                    ...current,
                    service,
                    stage: "select-address",
                })),
            setAddress: (address: string) =>
                setBooking((current) => ({
                    ...current,
                    address,
                    stage: "select-slot",
                })),
            setSchedule: (date: string, slot: string) =>
                setBooking((current) => ({
                    ...current,
                    date,
                    slot,
                    stage: "confirm-booking",
                })),
            setStage: (stage: BookingStage) =>
                setBooking((current) => ({
                    ...current,
                    stage,
                })),
            setFeedback: (rating: number, feedback: string) =>
                setBooking((current) => ({
                    ...current,
                    rating,
                    feedback,
                })),
            resetBooking: () => setBooking(initialBooking),
        }),
        [booking]
    );

    return (
        <CustomerBookingContext.Provider value={value}>
            {children}
        </CustomerBookingContext.Provider>
    );
}

export function useCustomerBooking() {
    const context = useContext(CustomerBookingContext);

    if (!context) {
        throw new Error("useCustomerBooking must be used within CustomerBookingProvider");
    }

    return context;
}
