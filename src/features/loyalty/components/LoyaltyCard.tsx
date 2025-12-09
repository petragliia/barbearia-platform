'use client';

import { motion } from 'framer-motion';
import { Star, Gift, CheckCircle2 } from 'lucide-react';
import { LoyaltyConfig, LoyaltyCard as LoyaltyCardType } from '../types';
import { cn } from '@/lib/utils';

interface LoyaltyCardProps {
    config: LoyaltyConfig;
    card?: LoyaltyCardType | null;
    loading?: boolean;
}

export default function LoyaltyCard({ config, card, loading }: LoyaltyCardProps) {
    const points = card?.balance || 0;
    const totalSlots = config.pointsRequired;
    const progress = Math.min((points / totalSlots) * 100, 100);

    if (!config.enabled) return null;

    return (
        <div className="w-full max-w-md mx-auto perspective-1000">
            <motion.div
                initial={{ rotateX: 10 }}
                whileHover={{ rotateX: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                    "relative overflow-hidden rounded-2xl shadow-xl border-t border-white/20",
                    "bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 text-white"
                )}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                            Fidelidade VIP
                        </h3>
                        <p className="text-sm text-gray-400">
                            Junte {config.pointsRequired} selos e ganhe:
                        </p>
                        <p className="text-base font-medium text-yellow-500 mt-1">
                            {config.rewardName}
                        </p>
                    </div>
                    <div className="bg-yellow-500/10 p-3 rounded-full border border-yellow-500/20">
                        <Gift className="text-yellow-500" size={24} />
                    </div>
                </div>

                {/* Grid de Selos */}
                <div className="grid grid-cols-5 gap-3 mb-6">
                    {Array.from({ length: totalSlots }).map((_, i) => {
                        const isCompleted = i < points;
                        return (
                            <motion.div
                                key={i}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className={cn(
                                    "aspect-square rounded-full flex items-center justify-center border-2 border-dashed transition-all",
                                    isCompleted
                                        ? "bg-yellow-500 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                                        : "border-gray-700 bg-gray-800/50"
                                )}
                            >
                                {isCompleted ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring" }}
                                    >
                                        <Star size={16} className="text-black fill-black" />
                                    </motion.div>
                                ) : (
                                    <span className="text-xs text-gray-600 font-mono">{i + 1}</span>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer / Status */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <span className="text-xs text-gray-500 font-mono">
                        ID: {card?.id?.slice(0, 8).toUpperCase() || 'NOVO'}
                    </span>
                    <div className="text-right">
                        <span className="text-2xl font-bold">{points}</span>
                        <span className="text-gray-400 text-sm">/{totalSlots}</span>
                    </div>
                </div>

                {/* Efeitos de Fundo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            </motion.div>

            {/* Mensagem de Conclusão */}
            {points >= totalSlots && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 text-green-500"
                >
                    <CheckCircle2 size={24} />
                    <p className="font-medium text-sm">
                        Parabéns! Você já pode resgatar seu prêmio na próxima visita.
                    </p>
                </motion.div>
            )}
        </div>
    );
}
