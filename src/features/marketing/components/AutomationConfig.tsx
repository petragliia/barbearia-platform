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
                    <div key={rule.id} className={`bg-slate-800 p-6 rounded-2xl border transition-all ${rule.enabled ? 'border-blue-900/50 shadow-sm' : 'border-slate-700 opacity-75'}`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${rule.enabled ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700 text-slate-500'}`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-slate-100">{rule.title}</h3>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={rule.enabled}
                                                onChange={() => toggleRule(rule.id)}
                                            />
                                            <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <p className="text-sm text-slate-400">{rule.description}</p>
                                </div>
                            </div>

                            {rule.enabled && (
                                <div className="flex items-center gap-2 pl-16 md:pl-0">
                                    <button
                                        onClick={() => toggleChannel(rule.id, 'email')}
                                        className={`p-2 rounded-lg border transition-colors ${rule.channels.email ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-700/50 border-slate-600 text-slate-500 hover:text-slate-300'}`}
                                        title="Email"
                                    >
                                        <Mail size={18} />
                                    </button>
                                    <button
                                        onClick={() => toggleChannel(rule.id, 'whatsapp')}
                                        className={`p-2 rounded-lg border transition-colors ${rule.channels.whatsapp ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-slate-700/50 border-slate-600 text-slate-500 hover:text-slate-300'}`}
                                        title="WhatsApp"
                                    >
                                        <MessageSquare size={18} />
                                    </button>
                                    <button
                                        onClick={() => toggleChannel(rule.id, 'sms')}
                                        className={`p-2 rounded-lg border transition-colors ${rule.channels.sms ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-slate-700/50 border-slate-600 text-slate-500 hover:text-slate-300'}`}
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
