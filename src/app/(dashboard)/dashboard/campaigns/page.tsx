'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChannelConfig from '@/features/campaigns/components/ChannelConfig';
import AutomationsList from '@/features/campaigns/components/AutomationsList';
import CampaignForm from '@/features/campaigns/components/CampaignForm';
import { MessageSquare, Zap, Send } from 'lucide-react';

/**
 * Campaigns & Notifications Dashboard Page
 * 
 * Architecture Notes:
 * - Main page file kept minimal, delegates to feature-specific components
 * - All domain logic lives in src/features/campaigns/components
 * - Follows Feature-Based Architecture principles
 */

export default function CampaignsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Campanhas & Notificações</h1>
                <p className="text-slate-400 mt-2">
                    Configure canais, automações e envie mensagens em massa para seus clientes.
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="channels" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-900 border border-slate-800">
                    <TabsTrigger
                        value="channels"
                        className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"
                    >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Canais
                    </TabsTrigger>
                    <TabsTrigger
                        value="automations"
                        className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"
                    >
                        <Zap className="h-4 w-4 mr-2" />
                        Automações
                    </TabsTrigger>
                    <TabsTrigger
                        value="campaigns"
                        className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"
                    >
                        <Send className="h-4 w-4 mr-2" />
                        Disparos
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="channels" className="mt-6">
                    <ChannelConfig />
                </TabsContent>

                <TabsContent value="automations" className="mt-6">
                    <AutomationsList />
                </TabsContent>

                <TabsContent value="campaigns" className="mt-6">
                    <CampaignForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
