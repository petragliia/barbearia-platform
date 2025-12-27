import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDWUEw_QNp8R17Utk9vuUTb16frSmI_4x8",
    authDomain: "barbearia-f8b17.firebaseapp.com",
    projectId: "barbearia-f8b17",
    storageBucket: "barbearia-f8b17.firebasestorage.app",
    messagingSenderId: "598280900386",
    appId: "1:598280900386:web:ceabf9249851b617621f7b",
    measurementId: "G-S025XF97ZP"
};

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize Analytics only on client side and if supported
let analytics;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, db, auth, analytics, storage };
