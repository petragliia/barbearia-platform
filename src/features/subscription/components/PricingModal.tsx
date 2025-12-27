'use client';

import { useSubscription } from "../hooks/useSubscription";

import { Check, Star, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export function PricingModal() {
    const { isUpgradeModalOpen, closeUpgradeModal, upgradePlan, currentPlan, loading } = useSubscription();

    const plans = [
        {
            id: 'STARTER',
            title: 'Starter',
            price: 'R$ 30',
            description: 'Para quem está começando.',
            features: ['10 Serviços', 'Sem anúncios', 'Agendamento Online', 'Suporte Básico'],
            icon: Star,
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10'
        },
        {
            id: 'PRO',
            title: 'Pro',
            price: 'R$ 97',
            description: 'Para crescer sua barbearia.',
            popular: true,
            features: ['Serviços Ilimitados', 'Domínio Próprio', 'SEO Local Otimizado', 'Disparo de WhatsApp (100/mês)', 'Marketing Básico'],
            icon: Zap,
            color: 'text-purple-400',
            bgColor: 'bg-purple-400/10'
        },
        {
            id: 'BUSINESS',
            title: 'Business',
            price: 'R$ 150',
            description: 'Gestão completa e escala.',
            features: ['Tudo do Pro', 'Venda de Produtos', 'Controle de Estoque', 'Múltiplos Profissionais', 'API de WhatsApp Ilimitada'],
            icon: Crown,
            color: 'text-amber-400',
            bgColor: 'bg-amber-400/10'
        },
    ];

    if (!isUpgradeModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-5xl bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-8 pb-4 text-center relative z-10">
                    <button onClick={closeUpgradeModal} className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Escolha o plano ideal</h2>
                    <p className="text-slate-400 max-w-lg mx-auto">Desbloqueie todo o potencial da sua barbearia com nossas ferramentas premium.</p>
                </div>

                {/* Body */}
                <div className="p-8 pt-4 overflow-y-auto flex-1">
                    <div className="grid md:grid-cols-3 gap-6">
                        {plans.map((plan) => {
                            const isCurrent = currentPlan === plan.id;
                            return (
                                <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`relative p-6 rounded-2xl border ${plan.popular ? 'border-purple-500/50 bg-slate-900/50' : 'border-slate-800 bg-slate-900/30'} flex flex-col hover:bg-slate-900 hover:border-slate-700 transition-all duration-300`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase shadow-lg shadow-purple-600/20">
                                            Mais Popular
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <div className={`w-12 h-12 rounded-xl ${plan.bgColor} flex items-center justify-center mb-4`}>
                                            <plan.icon size={24} className={plan.color} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{plan.title}</h3>
                                        <p className="text-slate-400 text-sm h-10">{plan.description}</p>
                                    </div>

                                    <div className="mb-8">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-white">{plan.price}</span>
                                            <span className="text-slate-500 text-sm">/mês</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-3 mb-8 flex-1">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                                <Check size={16} className={`mt-0.5 ${plan.color}`} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        onClick={() => userWantsUpgrade(plan.id as PlanType)}
                                        disabled={isCurrent || loading}
                                        className={`w-full py-6 rounded-xl font-bold transition-all ${isCurrent
                                            ? 'bg-slate-800 text-slate-400 cursor-default'
                                            : plan.popular
                                                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/20'
                                                : 'bg-white text-slate-900 hover:bg-slate-100'
                                            }`}
                                    >
                                        {isCurrent ? 'Plano Atual' : (loading ? 'Processando...' : 'Assinar Agora')}
                                    </Button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );

    function userWantsUpgrade(planId: string) {
        // Map the planId from the local constant to the real plan configuration
        // The local plan array in this file seems to use 'STARTER', 'PRO', 'BUSINESS' as IDs
        // But VISIBLE_PLANS uses 'starter', 'pro', 'business' (lowercase)

        // Let's find the matching plan in VISIBLE_PLANS
        // Assuming planId passed here is like 'STARTER'
        const targetPlan = import_plans.VISIBLE_PLANS.find(p => p.tier === planId);

        if (targetPlan?.stripePriceId) {
            upgradePlan(targetPlan.stripePriceId);
        } else {
            // Fallback or error if price ID is missing
            console.error("No price ID found for plan", planId);
        }
    }
}

import * as import_plans from "@/config/plans"; // Import at bottom if needed or move to top
