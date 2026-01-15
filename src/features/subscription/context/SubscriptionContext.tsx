'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { PlanTier } from '@/config/plans';
import { createClient } from '@/lib/supabase/client';

interface SubscriptionContextType {
    currentPlan: PlanTier;
    loading: boolean;
    upgradePlan: (priceId: string) => Promise<void>;
    checkAccess: (feature: string) => boolean;
    openUpgradeModal: () => void;
    closeUpgradeModal: () => void;
    isUpgradeModalOpen: boolean;
    subscriptionStatus: string;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const [currentPlan, setCurrentPlan] = useState<PlanTier>('FREE');
    const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
    const [loading, setLoading] = useState(true);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const { toast } = useToast();
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    // Safety timeout
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Initial Session Check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUser(session.user);
            } else {
                setLoading(false);
            }
        });

        // Auth State Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (!session?.user) {
                setCurrentPlan('FREE');
                setSubscriptionStatus('inactive');
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    // Fetch Plan from Profile
    useEffect(() => {
        if (!user) return;

        async function fetchProfile() {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('subscription_data, is_premium, plan') // Assuming fields
                    .eq('id', user.id)
                    .single();

                if (data) {
                    // Decide source of truth. Usually 'plan' column or inside subscription_data
                    // Mapping: subscription_data might have 'plan'
                    const subData = data.subscription_data as any; // Cast if needed

                    if (subData) {
                        setCurrentPlan(subData.plan || data.plan || 'FREE');
                        setSubscriptionStatus(subData.status || 'inactive');
                    } else {
                        // Fallback to top level column if exists
                        setCurrentPlan(data.plan || 'FREE');
                        setSubscriptionStatus('inactive');
                    }
                }
            } catch (err) {
                console.error("Error fetching subscription:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();

        // Optional: Realtime subscription for profile updates
        /*
        const channel = supabase.channel('profile_updates')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, (payload) => {
                 // handle update
                 fetchProfile();
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); }
        */

    }, [user, supabase]);

    const upgradePlan = async (priceId: string) => {
        if (!user) {
            toast({
                title: "Erro",
                description: "Você precisa estar logado para assinar.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            // Replaced getIdToken() with session access token handled by server action or client
            // Actually, for API routes, we need the session cookie or token.
            // Supabase client handles cookies automatically for requests if configured?
            // Or we pass the bearer token.

            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ priceId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao iniciar checkout');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("URL de checkout não encontrada");
            }
        } catch (error: any) {
            console.error("Upgrade error:", error);
            toast({
                title: "Erro no Checkout",
                description: error.message,
                variant: "destructive"
            });
            setLoading(false);
        }
    };

    const checkAccess = (feature: string): boolean => {
        if (currentPlan === 'BUSINESS') return true;
        // Simple fallback
        return true;
    };

    const openUpgradeModal = () => setIsUpgradeModalOpen(true);
    const closeUpgradeModal = () => setIsUpgradeModalOpen(false);

    return (
        <SubscriptionContext.Provider value={{
            currentPlan,
            loading,
            upgradePlan,
            checkAccess,
            openUpgradeModal,
            closeUpgradeModal,
            isUpgradeModalOpen,
            subscriptionStatus
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscriptionContext() {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
    }
    return context;
}
