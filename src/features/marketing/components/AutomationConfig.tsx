'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Smartphone, Calendar, Gift, Scissors } from 'lucide-react';

interface AutomationRule {
    id: string;
    title: string;
    description: string;
    icon: any;
    enabled: boolean;
    channels: {
        email: boolean;
        whatsapp: boolean;
        sms: boolean;
    };
}

export default function AutomationConfig() {
    const [rules, setRules] = useState<AutomationRule[]>([
        {
            id: 'welcome',
            title: 'Boas-vindas',
            description: 'Enviar mensagem quando um novo cliente se cadastrar.',
            icon: Gift,
            enabled: true,
            channels: { email: true, whatsapp: true, sms: false },
        },
        {
            id: 'reminder',
            title: 'Lembrete de Corte',
            description: 'Avisar 24h antes do agendamento.',
            icon: Calendar,
            enabled: true,
            channels: { email: true, whatsapp: true, sms: true },
        },
        {
            id: 'return',
            title: 'Reconvocação',
            description: 'Sugerir novo corte após 30 dias sem visita.',
            icon: Scissors,
            enabled: false,
            channels: { email: true, whatsapp: false, sms: false },
        },
        {
            id: 'birthday',
            title: 'Aniversário',
            description: 'Enviar parabéns e cupom de desconto.',
            icon: Gift,
            enabled: true,
            channels: { email: true, whatsapp: true, sms: false },
        },
    ]);

    const toggleRule = (id: string) => {
        setRules(rules.map(rule =>
            rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
        ));
    };

    const toggleChannel = (id: string, channel: 'email' | 'whatsapp' | 'sms') => {
        setRules(rules.map(rule =>
            rule.id === id ? {
                ...rule,
                channels: { ...rule.channels, [channel]: !rule.channels[channel] }
            } : rule
        ));
    };

    return (
        <div className="grid grid-cols-1 gap-4">
            {rules.map((rule) => {
                const Icon = rule.icon;
                return (
                    <div key={rule.id} className={`bg-white p-6 rounded-2xl border transition-all ${rule.enabled ? 'border-blue-200 shadow-sm' : 'border-gray-100 opacity-75'}`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${rule.enabled ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-gray-900">{rule.title}</h3>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={rule.enabled}
                                                onChange={() => toggleRule(rule.id)}
                                            />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <p className="text-sm text-gray-500">{rule.description}</p>
                                </div>
                            </div>

                            {rule.enabled && (
                                <div className="flex items-center gap-2 pl-16 md:pl-0">
                                    <button
                                        onClick={() => toggleChannel(rule.id, 'email')}
                                        className={`p-2 rounded-lg border transition-colors ${rule.channels.email ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                                        title="Email"
                                    >
                                        <Mail size={18} />
                                    </button>
                                    <button
                                        onClick={() => toggleChannel(rule.id, 'whatsapp')}
                                        className={`p-2 rounded-lg border transition-colors ${rule.channels.whatsapp ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                                        title="WhatsApp"
                                    >
                                        <MessageSquare size={18} />
                                    </button>
                                    <button
                                        onClick={() => toggleChannel(rule.id, 'sms')}
                                        className={`p-2 rounded-lg border transition-colors ${rule.channels.sms ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                                        title="SMS"
                                    >
                                        <Smartphone size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
