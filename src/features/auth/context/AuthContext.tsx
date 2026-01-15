'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
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
    const supabase = createClient();

    useEffect(() => {
        const fetchProfile = async (userId: string, email?: string) => {
            try {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (profile) {
                    // Map snake_case from DB to camelCase for the app
                    const mappedProfile: UserProfile = {
                        uid: profile.id,
                        level: profile.level,
                        plan: profile.plan,
                        subscriptionStatus: profile.subscription_status,
                        email: profile.email,
                        addons: profile.addons || [],
                        createdAt: profile.created_at
                    };
                    setUserProfile(mappedProfile);
                } else if (!error && !profile) {
                    // Create new profile if it doesn't exist
                    const newProfile: UserProfile = {
                        uid: userId,
                        level: 'beginner',
                        plan: 'FREE',
                        subscriptionStatus: 'ACTIVE',
                        email: email,
                        addons: [],
                        createdAt: new Date().toISOString()
                    };

                    // Supabase 'profiles' table usually uses 'id' as PK which references auth.users
                    const { error: insertError } = await supabase
                        .from('profiles')
                        .insert([{
                            id: userId,
                            level: 'beginner',
                            plan: 'FREE',
                            subscription_status: 'ACTIVE', // DB likely snake_case
                            email: email,
                            addons: [],
                            created_at: new Date().toISOString()
                        }]);

                    if (!insertError) {
                        setUserProfile(newProfile);
                    } else {
                        console.error("Error creating user profile:", insertError);
                    }
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user);
                // Cookie setting works differently with Supabase Auth helpers (SSR), 
                // usually handled by middleware + server client, but we can set a flag if needed.
                // Ideally depend on Supabase's automatic cookie handling.

                await fetchProfile(session.user.id, session.user.email);
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    const signInAnonymous = async () => {
        try {
            // Supabase anonymous sign-in requires specific configuration
            const { data, error } = await supabase.auth.signInAnonymously();
            if (error) throw error;
            return data.user;
        } catch (error) {
            console.error('Error signing in anonymously:', error);
            return null;
        }
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            setUserProfile(null);
            setUser(null);
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
