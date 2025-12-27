'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { PlanTier } from '@/config/plans';

export type UserLevel = 'beginner' | 'pro';

export interface UserProfile {
    uid: string;
    level: UserLevel;
    plan: PlanTier;
    subscriptionStatus: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING';
    email?: string | null;
    addons?: string[]; // e.g., 'marketing', 'analytics'
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signInAnonymous: () => Promise<User | null>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Set a simple cookie for middleware to detect session
                document.cookie = "auth_token=true; path=/; max-age=2592000; SameSite=Strict"; // 30 days

                // Fetch or create user profile
                try {
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setUserProfile(userDoc.data() as UserProfile);
                    } else {
                        // Create new profile for new user
                        const newProfile: UserProfile = {
                            uid: firebaseUser.uid,
                            level: 'beginner',
                            plan: 'FREE', // Default plan
                            subscriptionStatus: 'ACTIVE',
                            email: firebaseUser.email,
                            addons: [],
                            createdAt: new Date().toISOString()
                        };
                        await setDoc(userDocRef, newProfile);
                        setUserProfile(newProfile);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            } else {
                // Remove cookie
                document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInAnonymous = async () => {
        try {
            const result = await signInAnonymously(auth);
            return result.user;
        } catch (error) {
            console.error('Error signing in anonymously:', error);
            return null;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUserProfile(null);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, signInAnonymous, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
