'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Cake, Settings } from 'lucide-react';

/**
 * Component for managing automated notification triggers
 * 
 * Future Backend Integration (Firebase):
 * Save to: `barbershops/{barberId}/settings/automations`
 * Structure: { confirmation: { enabled: boolean }, reminder: { enabled: boolean }, birthday: { enabled: boolean } }
 */

import { Campaign } from '../types';

interface Props {
    campaigns: Campaign[];
    onRefresh: () => void;
}

export default function AutomationsList({ campaigns, onRefresh }: Props) {
    const automations = [
        {
            id: 'confirmation',
            name: '✅ Confirmação de Agendamento',
            description: 'Enviado assim que o cliente agendar um horário.',
            icon: CheckCircle,
            type: 'marketing'
        },
        {
            id: 'reminder',
            name: '⏰ Lembrete de Corte',
            description: 'Enviado 24h antes do horário agendado.',
            icon: Clock,
            type: 'reminder'
        },
        {
            id: 'birthday',
            name: '🎂 Aniversário do Cliente',
            description: 'Enviado no dia do aniversário com uma mensagem personalizada.',
            icon: Cake,
            type: 'marketing'
        }
    ];

    const getStatus = (type: string) => {
        // Simple logic: if any campaign of this type is active, it's enabled.
        // Real logic might need specific IDs or tags.
        return campaigns.some(c => c.type === type && c.active);
    };

    const toggleAutomation = (type: string) => {
        // Logic to toggle would go to service
        // For MVP display, we just show status
        console.log("Toggle not implemented yet for specific automation types");
    };

    return (
        <div className="space-y-4">

            {automations.map((automation) => {
                const isEnabled = getStatus(automation.type);
                const Icon = automation.icon;
                return (
                    <Card key={automation.id} className="p-6 bg-slate-900 border-slate-800">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className={`p-3 rounded-lg ${isEnabled ? 'bg-blue-500/10' : 'bg-slate-800'
                                    }`}>
                                    <Icon className={`h-5 w-5 ${isEnabled ? 'text-blue-500' : 'text-slate-500'
                                        }`} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-base font-semibold text-white mb-1">
                                        {automation.name}
                                    </h4>
                                    <p className="text-sm text-slate-400">
                                        {automation.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={isEnabled}
                                    onCheckedChange={() => toggleAutomation(automation.type)}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                                >
                                    <Settings className="h-4 w-4 mr-1" />
                                    Editar Modelo
                                </Button>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
