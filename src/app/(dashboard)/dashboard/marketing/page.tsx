'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Copy, MessageSquare, Send, Zap, Crown, Megaphone } from 'lucide-react';
import MarketingStats from '@/features/marketing/components/MarketingStats';
import AutomationConfig from '@/features/marketing/components/AutomationConfig';
import LoyaltyDashboardConfig from '@/features/loyalty/components/LoyaltyDashboardConfig';
import { useFeatureAccess } from '@/features/marketing/hooks/useFeatureAccess';
import FeatureLocked from '@/features/dashboard/components/FeatureLocked';
import { useAuth } from '@/features/auth/context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LoyaltyConfig } from '@/features/loyalty/types';

export default function MarketingPage() {
    const hasAccess = useFeatureAccess('marketing');
    const { user } = useAuth();
    const [loyaltyConfig, setLoyaltyConfig] = useState<LoyaltyConfig | undefined>(undefined);

    useEffect(() => {
        if (!user) return;
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, 'barbershops', user.uid);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setLoyaltyConfig(snap.data().loyalty);
                }
            } catch (error) {
                console.error("Error fetching loyalty config:", error);
            }
        };
        fetchConfig();
    }, [user]);

    if (!hasAccess) {
        return (
            <FeatureLocked
                title="Funcionalidade Bloqueada"
                description="O módulo de Marketing e Comunicação é um recurso exclusivo. Faça um upgrade no seu plano para desbloquear automações de mensagens e campanhas."
            />
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-100">Marketing e Comunicação</h1>
                <p className="text-slate-400">Gerencie suas campanhas e automações de mensagens.</p>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-800 text-slate-400">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-slate-900 data-[state=active]:text-slate-100">Visão Geral</TabsTrigger>
                    <TabsTrigger value="automations" className="data-[state=active]:bg-slate-900 data-[state=active]:text-slate-100">Automações</TabsTrigger>
                    <TabsTrigger value="campaigns" className="data-[state=active]:bg-slate-900 data-[state=active]:text-slate-100">Campanhas</TabsTrigger>
                    <TabsTrigger value="loyalty" className="flex items-center gap-2 data-[state=active]:bg-slate-900 data-[state=active]:text-slate-100">
                        <Crown size={14} className="text-yellow-500" />
                        Fidelidade
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <MarketingStats />
                </TabsContent>

                <TabsContent value="automations" className="mt-6">
                    <AutomationConfig />
                </TabsContent>

                <TabsContent value="campaigns" className="mt-6">
                    <Card className="bg-slate-800 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-slate-100">Campanhas em Massa</CardTitle>
                            <CardDescription className="text-slate-400">Envie promoções para toda sua base de clientes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12 text-slate-500">
                                <p>Funcionalidade de campanhas em breve.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="loyalty" className="mt-6">
                    <LoyaltyDashboardConfig
                        barbershopId={user?.uid || ''}
                        initialConfig={loyaltyConfig}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
