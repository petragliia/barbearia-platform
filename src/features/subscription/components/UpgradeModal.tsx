'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useSubscriptionContext } from '../context/SubscriptionContext';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { VISIBLE_PLANS, PlanTier } from '@/config/plans';
import { cn } from '@/lib/utils';

export default function UpgradeModal() {
    const { isUpgradeModalOpen, closeUpgradeModal, upgradePlan } = useSubscriptionContext();
    const { plan: currentPlan } = usePermission();

    const handleUpgrade = async (planId: string) => {
        const plan = VISIBLE_PLANS.find(p => p.id === planId);
        if (plan?.stripePriceId) {
            await upgradePlan(plan.stripePriceId);
        } else {
            console.error("Price ID not found for plan:", planId);
        }
    };

    return (
        <AnimatePresence>
            {isUpgradeModalOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        onClick={closeUpgradeModal}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[101] p-6 md:p-8"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Escolha seu Plano</h2>
                                <p className="text-slate-400">Desbloqueie todo o potencial da sua barbearia hoje mesmo.</p>
                            </div>
                            <button
                                onClick={closeUpgradeModal}
                                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {VISIBLE_PLANS.filter(p => p.tier !== 'FREE').map((plan) => {
                                const isCurrent = currentPlan === plan.tier;
                                const isRecommended = plan.recommended;

                                return (
                                    <div
                                        key={plan.id}
                                        className={cn(
                                            "relative p-6 rounded-xl border flex flex-col h-full bg-slate-950/50",
                                            isCurrent ? "border-slate-700 opacity-60 pointer-events-none grayscale" :
                                                isRecommended
                                                    ? "border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)] bg-slate-900"
                                                    : "border-slate-800 hover:border-slate-700"
                                        )}
                                    >
                                        {isRecommended && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-500 text-black text-xs font-bold rounded-full uppercase tracking-wider animate-pulse">
                                                Recomendado
                                            </div>
                                        )}
                                        {isCurrent && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-700 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                                Atual
                                            </div>
                                        )}

                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                            <div className="flex items-baseline">
                                                <span className="text-3xl font-bold text-white">R$ {(plan.price / 100).toFixed(0)}</span>
                                                <span className="text-slate-400 ml-1">/mês</span>
                                            </div>
                                        </div>

                                        <ul className="space-y-3 mb-8 flex-1">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                                                    <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            className={cn(
                                                "w-full font-bold",
                                                isRecommended ? "bg-cyan-500 hover:bg-cyan-400 text-black" : "bg-white text-black hover:bg-slate-200"
                                            )}
                                            onClick={() => handleUpgrade(plan.id)}
                                            disabled={isCurrent}
                                        >
                                            {isCurrent ? "Seu Plano Atual" : "Assinar Agora"}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
