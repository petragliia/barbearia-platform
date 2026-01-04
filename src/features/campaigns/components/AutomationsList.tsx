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

interface Automation {
    id: string;
    name: string;
    description: string;
    icon: typeof CheckCircle;
    enabled: boolean;
}

export default function AutomationsList() {
    const [automations, setAutomations] = useState<Automation[]>([
        {
            id: 'confirmation',
            name: '✅ Confirmação de Agendamento',
            description: 'Enviado assim que o cliente agendar um horário.',
            icon: CheckCircle,
            enabled: true
        },
        {
            id: 'reminder',
            name: '⏰ Lembrete de Corte',
            description: 'Enviado 24h antes do horário agendado.',
            icon: Clock,
            enabled: true
        },
        {
            id: 'birthday',
            name: '🎂 Aniversário do Cliente',
            description: 'Enviado no dia do aniversário com uma mensagem personalizada.',
            icon: Cake,
            enabled: false
        }
    ]);

    const toggleAutomation = (id: string) => {
        setAutomations(prev =>
            prev.map(auto =>
                auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
            )
        );
    };

    return (
        <div className="space-y-4">
            {automations.map((automation) => {
                const Icon = automation.icon;
                return (
                    <Card key={automation.id} className="p-6 bg-slate-900 border-slate-800">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className={`p-3 rounded-lg ${automation.enabled ? 'bg-blue-500/10' : 'bg-slate-800'
                                    }`}>
                                    <Icon className={`h-5 w-5 ${automation.enabled ? 'text-blue-500' : 'text-slate-500'
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
                                    checked={automation.enabled}
                                    onCheckedChange={() => toggleAutomation(automation.id)}
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
