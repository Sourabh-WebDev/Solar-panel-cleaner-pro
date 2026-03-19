import * as Location from "expo-location";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

type PermissionState = "idle" | "granted" | "denied";

type LocationPoint = {
    latitude: number;
    longitude: number;
};

type TechnicianLocationContextValue = {
    permissionState: PermissionState;
    currentLocation: LocationPoint | null;
    isTracking: boolean;
    isStartingTracking: boolean;
    isUsingCachedLocation: boolean;
    lastUpdatedAt: string | null;
    permissionMessage: string | null;
    trackingError: string | null;
    requestPermissionAndStartTracking: () => Promise<boolean>;
    retryTracking: () => Promise<boolean>;
};

const TechnicianLocationContext = createContext<TechnicianLocationContextValue | undefined>(undefined);

export function TechnicianLocationProvider({ children }: { children: ReactNode }) {
    const [permissionState, setPermissionState] = useState<PermissionState>("idle");
    const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [isStartingTracking, setIsStartingTracking] = useState(false);
    const [isUsingCachedLocation, setIsUsingCachedLocation] = useState(false);
    const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
    const [permissionMessage, setPermissionMessage] = useState<string | null>(null);
    const [trackingError, setTrackingError] = useState<string | null>(null);
    const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

    useEffect(() => {
        return () => {
            subscriptionRef.current?.remove();
        };
    }, []);

    const applyLocationUpdate = (latitude: number, longitude: number, fromCache: boolean) => {
        setCurrentLocation({ latitude, longitude });
        setIsUsingCachedLocation(fromCache);
        setLastUpdatedAt(new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        }));
    };

    const requestPermissionAndStartTracking = async () => {
        try {
            setIsStartingTracking(true);
            setPermissionMessage(null);
            setTrackingError(null);

            const permission = await Location.requestForegroundPermissionsAsync();

            if (!permission.granted) {
                setPermissionState("denied");
                setIsTracking(false);
                setIsUsingCachedLocation(false);
                setPermissionMessage("Location permission is required to send live technician GPS.");
                return false;
            }

            setPermissionState("granted");

            try {
                const current = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                applyLocationUpdate(current.coords.latitude, current.coords.longitude, false);
            } catch {
                const cached = await Location.getLastKnownPositionAsync({
                    maxAge: 1000 * 60 * 10,
                    requiredAccuracy: 500,
                });

                if (cached) {
                    applyLocationUpdate(cached.coords.latitude, cached.coords.longitude, true);
                    setTrackingError("Network/GPS issue detected. Showing cached location until live tracking resumes.");
                } else {
                    throw new Error("NO_LOCATION_FIX");
                }
            }

            subscriptionRef.current?.remove();
            subscriptionRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    distanceInterval: 10,
                    timeInterval: 10000,
                },
                (position) => {
                    applyLocationUpdate(position.coords.latitude, position.coords.longitude, false);
                    setTrackingError(null);
                    setIsTracking(true);
                }
            );

            setIsTracking(true);
            return true;
        } catch {
            setPermissionMessage("Unable to start GPS tracking on this device right now.");
            setTrackingError("Retry the location service when network/GPS becomes available.");
            setIsTracking(false);
            return false;
        } finally {
            setIsStartingTracking(false);
        }
    };

    const retryTracking = async () => {
        return requestPermissionAndStartTracking();
    };

    const value = useMemo(
        () => ({
            permissionState,
            currentLocation,
            isTracking,
            isStartingTracking,
            isUsingCachedLocation,
            lastUpdatedAt,
            permissionMessage,
            trackingError,
            requestPermissionAndStartTracking,
            retryTracking,
        }),
        [
            currentLocation,
            isStartingTracking,
            isTracking,
            isUsingCachedLocation,
            lastUpdatedAt,
            permissionMessage,
            permissionState,
            trackingError,
        ]
    );

    return (
        <TechnicianLocationContext.Provider value={value}>
            {children}
        </TechnicianLocationContext.Provider>
    );
}

export function useTechnicianLocation() {
    const context = useContext(TechnicianLocationContext);

    if (!context) {
        throw new Error("useTechnicianLocation must be used within TechnicianLocationProvider");
    }

    return context;
}
