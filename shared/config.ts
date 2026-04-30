// Replace with your actual Google Maps API key
// Get one at: https://console.cloud.google.com/
// Enable: Maps SDK for Android, Maps SDK for iOS, Directions API
export const GOOGLE_MAPS_API_KEY = "AIzaSyAGhlc6QZ1vgt4Fas-J3M_icIjTOOBSpI0";

// Firebase config
// Create project: https://console.firebase.google.com/
// Add these values to your .env as EXPO_PUBLIC_FIREBASE_* variables.
export const FIREBASE_CONFIG = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "",
};
