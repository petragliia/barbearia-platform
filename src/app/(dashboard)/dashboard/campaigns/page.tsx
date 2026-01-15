'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { useSubscription } from '@/features/subscription/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { UpgradeState } from '@/components/UpgradeState';
import { Plus, BarChart3, Mail, MessageCircle, Smartphone, Loader2 } from 'lucide-react';
import { campaignService } from '@/features/campaigns/services/CampaignService';
import { Campaign } from '@/features/campaigns/types';
import AutomationsList from '@/features/campaigns/components/AutomationsList';
import CampaignForm from '@/features/campaigns/components/CampaignForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function CampaignsPage() {
    const { user } = useAuth();
    const { checkAccess } = useSubscription();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { plan } = usePermission();

    const fetchCampaigns = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const { data, hasPermission } = await campaignService.getCampaigns(user.id, plan);

            if (!hasPermission) {
                // Future: We can set a 'locked' state here
                console.warn('User does not have permission for campaigns');
            }

            setCampaigns(data || []);
        } catch (error) {
            console.error("Failed to fetch campaigns", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // If user doesn't have access, we don't necessarily need to fetch, 
        // but checking inside the effect or before return is fine.
        fetchCampaigns();
    }, [user]);

    const handleCreateSuccess = () => {
        setIsCreateOpen(false);
        fetchCampaigns();
    };

    if (loading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
    }

    const hasAccess = checkAccess('campaigns');

    if (!hasAccess) {
        return (
            <UpgradeState
                featureName="Campanhas de Marketing"
                description="Automatize mensagens e fidelize seus clientes com campanhas inteligentes por WhatsApp e Email."
            />
        );
    }

    // Statistics
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.active).length;
    const totalSent = campaigns.reduce((acc, curr) => acc + (curr.metrics?.sent || 0), 0);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Campanhas & Automações</h1>
                    <p className="text-slate-400">Gerencie suas campanhas de marketing e fidelização.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-blue-900/20">
                            <Plus className="mr-2 h-5 w-5" /> Nova Campanha
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-800 text-white">
                        <CampaignForm onSuccess={handleCreateSuccess} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><BarChart3 size={64} /></div>
                    <p className="text-sm font-medium text-slate-400">Total de Campanhas</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{totalCampaigns}</h3>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><MessageCircle size={64} /></div>
                    <p className="text-sm font-medium text-slate-400">Ativas Agora</p>
                    <h3 className="text-3xl font-bold text-emerald-400 mt-2">{activeCampaigns}</h3>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Mail size={64} /></div>
                    <p className="text-sm font-medium text-slate-400">Mensagens Enviadas</p>
                    <h3 className="text-3xl font-bold text-blue-400 mt-2">{totalSent}</h3>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-xl">
                    <TabsTrigger value="all" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">Todas</TabsTrigger>
                    <TabsTrigger value="whatsapp" className="data-[state=active]:bg-green-900/40 data-[state=active]:text-green-400 text-slate-400">WhatsApp</TabsTrigger>
                    <TabsTrigger value="email" className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-400 text-slate-400">Email</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                    <AutomationsList campaigns={campaigns} onRefresh={fetchCampaigns} />
                </TabsContent>
                <TabsContent value="whatsapp" className="mt-6">
                    <AutomationsList campaigns={campaigns.filter(c => c.channel === 'whatsapp')} onRefresh={fetchCampaigns} />
                </TabsContent>
                <TabsContent value="email" className="mt-6">
                    <AutomationsList campaigns={campaigns.filter(c => c.channel === 'email')} onRefresh={fetchCampaigns} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
