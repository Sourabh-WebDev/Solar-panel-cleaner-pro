import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    type User,
} from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { FIREBASE_CONFIG } from "../config";

export type UserRole = "customer" | "technician";

type OtpRequestRecord = {
    requestId: string;
    role: UserRole;
    phone: string;
    otp: string;
    expiresAt: number;
};

type AuthSession = {
    isLoggedIn: boolean;
    role?: UserRole;
    phone?: string;
};

export type SendOtpInput = {
    phone: string;
    role: UserRole;
};

export type SendOtpResult = {
    requestId: string;
    expiresInSec: number;
    devOtp?: string;
};

export type VerifyOtpInput = {
    requestId: string;
    otp: string;
    role: UserRole;
};

export type VerifyOtpResult = {
    ok: boolean;
    message?: string;
};

const OTP_TTL_MS = 2 * 60 * 1000;
const otpRequests = new Map<string, OtpRequestRecord>();
const AUTH_CACHE_KEY = "scp_auth_cache_v1";

const firebaseApp = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

function onlyDigits(value: string) {
    return value.replace(/\D/g, "");
}

function normalizePhone(phone: string) {
    return onlyDigits(phone).slice(-10);
}

function generateOtp() {
    return String(Math.floor(1000 + Math.random() * 9000));
}

function toFirebaseEmail(phone: string, role: UserRole) {
    return `${role}.${phone}@solarcleaner.local`;
}

function toFirebasePassword(phone: string) {
    return `SCP@${phone}#2026`;
}

async function getRoleFromFirestore(uid: string): Promise<UserRole | null> {
    const snapshot = await getDoc(doc(db, "users", uid));
    if (!snapshot.exists()) {
        return null;
    }

    const role = snapshot.data()?.role;
    if (role === "customer" || role === "technician") {
        return role;
    }
    return null;
}

async function syncUserRole(uid: string, role: UserRole, phone: string) {
    await setDoc(
        doc(db, "users", uid),
        {
            role,
            phone,
            updatedAt: Date.now(),
        },
        { merge: true }
    );
}

async function signInOrCreateWithRole(phone: string, role: UserRole) {
    const email = toFirebaseEmail(phone, role);
    const password = toFirebasePassword(phone);

    try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        await syncUserRole(credential.user.uid, role, phone);
        await AsyncStorage.setItem(
            AUTH_CACHE_KEY,
            JSON.stringify({
                phone,
                role,
            })
        );
        return { ok: true as const };
    } catch (error: any) {
        if (error?.code !== "auth/invalid-credential" && error?.code !== "auth/user-not-found") {
            return { ok: false as const, message: "Authentication failed. Please try again." };
        }
    }

    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await syncUserRole(credential.user.uid, role, phone);
        await AsyncStorage.setItem(
            AUTH_CACHE_KEY,
            JSON.stringify({
                phone,
                role,
            })
        );
        return { ok: true as const };
    } catch {
        return { ok: false as const, message: "Unable to create account. Please try again." };
    }
}

function waitForAuthUser() {
    return new Promise<User | null>((resolve) => {
        const unsub = onAuthStateChanged(auth, (user) => {
            unsub();
            resolve(user);
        });
    });
}

function cleanupExpired() {
    const now = Date.now();
    for (const [requestId, record] of otpRequests.entries()) {
        if (record.expiresAt <= now) {
            otpRequests.delete(requestId);
        }
    }
}

export async function sendOtp(input: SendOtpInput): Promise<SendOtpResult> {
    cleanupExpired();
    const phone = normalizePhone(input.phone);

    if (phone.length !== 10) {
        throw new Error("Please enter a valid 10-digit phone number.");
    }

    const requestId = `${input.role}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const otp = generateOtp();

    otpRequests.set(requestId, {
        requestId,
        role: input.role,
        phone,
        otp,
        expiresAt: Date.now() + OTP_TTL_MS,
    });

    return {
        requestId,
        expiresInSec: OTP_TTL_MS / 1000,
        devOtp: __DEV__ ? otp : undefined,
    };
}

export async function resendOtp(requestId: string): Promise<SendOtpResult> {
    cleanupExpired();
    const current = otpRequests.get(requestId);

    if (!current) {
        throw new Error("OTP session expired. Please request OTP again.");
    }

    otpRequests.delete(requestId);
    return sendOtp({ phone: current.phone, role: current.role });
}

export async function verifyOtp(input: VerifyOtpInput): Promise<VerifyOtpResult> {
    cleanupExpired();
    const current = otpRequests.get(input.requestId);

    if (!current) {
        return { ok: false, message: "OTP session expired. Please resend OTP." };
    }

    if (current.role !== input.role) {
        return { ok: false, message: "Invalid OTP request." };
    }

    if (current.expiresAt <= Date.now()) {
        otpRequests.delete(input.requestId);
        return { ok: false, message: "OTP expired. Please resend OTP." };
    }

    if (onlyDigits(input.otp) !== current.otp) {
        return { ok: false, message: "Invalid OTP. Try again." };
    }

    const authResult = await signInOrCreateWithRole(current.phone, current.role);
    if (!authResult.ok) {
        return { ok: false, message: authResult.message };
    }

    const user = auth.currentUser;
    if (user) {
        const storedRole = await getRoleFromFirestore(user.uid);
        if (storedRole && storedRole !== input.role) {
            await signOut(auth);
            return { ok: false, message: "This account belongs to a different app role." };
        }
        await syncUserRole(user.uid, input.role, current.phone);
    }

    otpRequests.delete(input.requestId);
    return { ok: true };
}

export async function getCurrentAuthSession(): Promise<AuthSession> {
    let user = auth.currentUser ?? (await waitForAuthUser());

    if (!user) {
        const cached = await AsyncStorage.getItem(AUTH_CACHE_KEY);
        if (cached) {
            try {
                const parsed = JSON.parse(cached) as { phone?: string; role?: UserRole };
                if (parsed.phone && (parsed.role === "customer" || parsed.role === "technician")) {
                    const email = toFirebaseEmail(parsed.phone, parsed.role);
                    const password = toFirebasePassword(parsed.phone);
                    await signInWithEmailAndPassword(auth, email, password);
                    user = auth.currentUser ?? (await waitForAuthUser());
                }
            } catch {
                await AsyncStorage.removeItem(AUTH_CACHE_KEY);
            }
        }
    }

    if (!user) {
        return { isLoggedIn: false };
    }

    const role = await getRoleFromFirestore(user.uid);
    if (!role) {
        return { isLoggedIn: true };
    }

    const phone = user.email?.split(".")[1]?.split("@")[0];
    return {
        isLoggedIn: true,
        role,
        phone,
    };
}

export async function signOutCurrentUser() {
    await signOut(auth);
    await AsyncStorage.removeItem(AUTH_CACHE_KEY);
}
