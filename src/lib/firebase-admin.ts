import "server-only";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Check if we are in a serverless environment and need to initialize
// This logic prevents re-initialization on hot reloads in dev
const apps = getApps();

let app;

// In production/vercel, standard way is creating a service account object from env vars
// or using the default credential if on Google Cloud (not likely here, likely Vercel)
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : null;

if (apps.length === 0) {
    if (serviceAccount) {
        app = initializeApp({
            credential: cert(serviceAccount),
        });
    } else {
        // Fallback or dev mode without explicit service account (won't work for admin privileges usually)
        // For basic dev, you might skip this or error out.
        // We'll initialize with default if no service account (likely fails unless GOOGLE_APPLICATION_CREDENTIALS set)
        app = initializeApp();
    }
} else {
    app = apps[0];
}

export const dbAdmin = getFirestore(app);
export const authAdmin = getAuth(app);
