'use client';

import { Check, X, CreditCard, Rocket, Crown, Zap } from 'lucide-react';
import { useSubscription } from '@/features/subscription/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlanTier } from '@/config/plans';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function PlanPage() {
    const { currentPlan, upgradePlan } = useSubscription();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleUpgrade = async (plan: PlanTier) => {
        setIsLoading(plan);
        await upgradePlan(plan);
        setIsLoading(null);
    };

    const isCurrent = (plan: PlanTier) => currentPlan === plan;

    const plans = [
        {
            id: 'STARTER',
            name: 'Starter',
            price: 'R$ 29,90',
            period: '/mês',
            description: 'Tudo para começar sua presença digital.',
            features: [
                'Site Profissional (Template Clássico)',
                '1 Barbeiro',
                'Agendamento via WhatsApp',
                'Galeria de Fotos (até 10)',
                'Hospedagem Inclusa'
            ],
            notIncluded: [
                'Domínio Personalizado',
                'Templates Premium',
                'Gestão de Produtos',
                'Ferramentas de Marketing'
            ],
            color: 'bg-blue-600',
            icon: Rocket
        },
        {
            id: 'PRO',
            name: 'Pro',
            price: 'R$ 59,90',
            period: '/mês',
            description: 'Para barbearias que querem se destacar.',
            popular: true,
            features: [
                'Todos do Starter',
                '3 Barbeiros',
                'Templates Premium (Urban, Minimal)',
                'Domínio Personalizado (.com.br)',
                'Sem marca "Feito com BarberSaaS"',
                'Gestão de Avaliações'
            ],
            notIncluded: [
                'Loja de Produtos',
                'Campanhas de Marketing (SMS/Email)',
                'Programa de Fidelidade'
            ],
            color: 'bg-indigo-600',
            icon: Zap
        },
        {
            id: 'BUSINESS',
            name: 'Business',
            price: 'R$ 99,90',
            period: '/mês',
            description: 'Gestão completa e ferramentas de crescimento.',
            features: [
                'Todos do Pro',
                'Barbeiros Ilimitados',
                'Loja de Produtos Integrada',
                'Módulo de Marketing/Automação',
                'Programa de Fidelidade',
                'API para integração externa',
                'Suporte Prioritário VIP'
            ],
            notIncluded: [],
            color: 'bg-amber-500',
            icon: Crown
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-slate-100 tracking-tight mb-4">Seu Plano</h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Gerencie sua assinatura e desbloqueie recursos exclusivos para escalar sua barbearia.
                </p>

                <div className="mt-8 p-6 bg-slate-800 border border-slate-700 rounded-2xl text-white flex items-center justify-between shadow-xl">
                    <div>
                        <div className="text-slate-400 text-sm uppercase font-bold tracking-widest mb-1">Plano Atual</div>
                        <div className="text-3xl font-black">{currentPlan === 'FREE' ? 'Gratuito (Trial)' : currentPlan}</div>
                        <div className="text-slate-400 mt-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Ativo • Renovação em 15/01/2026
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={cn(
                            "relative bg-slate-800 rounded-2xl p-8 border hover:border-slate-600 transition-all duration-300 flex flex-col",
                            isCurrent(plan.id as PlanTier) ? "border-blue-500 ring-2 ring-blue-500/50" : "border-slate-700",
                            plan.popular && !isCurrent(plan.id as PlanTier) ? "border-indigo-500 shadow-indigo-500/10 shadow-2xl" : ""
                        )}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                                Mais Popular
                            </div>
                        )}

                        <div className="mb-8">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg", plan.color)}>
                                <plan.icon size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-100 mb-2">{plan.name}</h3>
                            <p className="text-slate-400 text-sm mb-6 h-10">{plan.description}</p>
                            <div className="flex items-baseline">
                                <span className="text-4xl font-black text-slate-100">{plan.price}</span>
                                <span className="text-slate-500 font-medium ml-1">{plan.period}</span>
                            </div>
                        </div>

                        <div className="flex-1 mb-8">
                            <ul className="space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-300">
                                        <div className="mt-0.5 min-w-[18px] h-[18px] rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                                {plan.notIncluded.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-500">
                                        <div className="mt-0.5 min-w-[18px] h-[18px] rounded-full bg-slate-700/50 flex items-center justify-center text-slate-500">
                                            <X size={12} strokeWidth={3} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button
                            className={cn(
                                "w-full py-6 font-bold text-lg uppercase tracking-wide",
                                isCurrent(plan.id as PlanTier)
                                    ? "bg-slate-700 text-slate-400 hover:bg-slate-700 cursor-default"
                                    : plan.popular ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20" : "bg-slate-100 text-slate-900 hover:bg-white"
                            )}
                            disabled={isCurrent(plan.id as PlanTier) || isLoading !== null}
                            onClick={() => !isCurrent(plan.id as PlanTier) && handleUpgrade(plan.id as PlanTier)}
                        >
                            {isLoading === plan.id ? (
                                <Loader2 className="animate-spin" />
                            ) : isCurrent(plan.id as PlanTier) ? (
                                "Plano Atual"
                            ) : (
                                "Escolher Plano"
                            )}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
