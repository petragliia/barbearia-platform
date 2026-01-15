'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { getBarbershop } from '@/lib/services/barbershopService';
import LoyaltyDashboardConfig from '@/features/loyalty/components/LoyaltyDashboardConfig';
import { LoyaltyConfig } from '@/features/loyalty/types';
import { Loader2 } from 'lucide-react';

export default function LoyaltyPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<LoyaltyConfig | undefined>(undefined);

    useEffect(() => {
        const fetchConfig = async () => {
            if (!user) return;
            try {
                const userId = (user as any).uid || user.id;
                const data = await getBarbershop(userId);
                if (data) {
                    setConfig(data.loyalty);
                }
            } catch (error) {
                console.error("Error fetching loyalty config:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Programa de Fidelidade</h1>
                <p className="text-slate-400">Configure as regras e recompensas para seus clientes mais fiéis.</p>
            </div>

            <LoyaltyDashboardConfig barbershopId={(user as any).uid || user.id} initialConfig={config} />
        </div>
    );
}
