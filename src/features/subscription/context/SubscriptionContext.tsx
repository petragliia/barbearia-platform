'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { PlanTier, VISIBLE_PLANS } from '@/config/plans';
// import { useAuth } from '@/components/providers/AuthProvider'; // Removed as we use firebase/auth directly
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

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

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setCurrentPlan('FREE');
                setSubscriptionStatus('inactive');
                setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!user) return;

        const unsubscribeFirestore = onSnapshot(doc(db, 'users', user.uid), (docSnapshot) => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                const sub = userData.subscription;

                if (sub) {
                    setCurrentPlan(sub.plan || 'FREE');
                    setSubscriptionStatus(sub.status || 'inactive');
                } else {
                    setCurrentPlan('FREE');
                    setSubscriptionStatus('inactive');
                }
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching subscription:", error);
            setLoading(false);
        });

        return () => unsubscribeFirestore();
    }, [user]);

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
            const token = await user.getIdToken();
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
        // Logic should match PLAN_FEATURES in config/plans.ts
        // For now, simple fallback or you can import canUser helper
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
