'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Zap, Star, Briefcase, Scissors } from 'lucide-react';
import Link from 'next/link';

export default function FeaturesMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const plans = [
        {
            name: 'Starter',
            icon: Scissors,
            color: 'text-slate-600',
            bgColor: 'bg-slate-100',
            features: [
                'Site Profissional',
                'Hospedagem Inclusa',
                'Agendamento WhatsApp',
                'Design Responsivo'
            ]
        },
        {
            name: 'Pro',
            icon: Star,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            features: [
                'Agendamento Online',
                'Gestão de Clientes',
                'Lembretes Automáticos',
                'SEO Local Otimizado',
                'Domínio Próprio'
            ]
        },
        {
            name: 'Empire',
            icon: Briefcase,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            features: [
                'Múltiplos Profissionais',
                'Gestão Financeira',
                'Venda de Produtos',
                'Fidelidade Digital',
                'Relatórios Avançados'
            ]
        }
    ];

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className="flex items-center gap-1 hover:text-blue-600 transition-colors py-4"
                onClick={() => setIsOpen(!isOpen)}
            >
                Funcionalidades
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-xl shadow-xl border border-slate-100 p-6 z-50 overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 via-blue-500 to-purple-500"></div>

                        <div className="grid grid-cols-3 gap-6">
                            {plans.map((plan, index) => (
                                <div key={plan.name} className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-8 h-8 rounded-lg ${plan.bgColor} ${plan.color} flex items-center justify-center`}>
                                            <plan.icon size={16} />
                                        </div>
                                        <h3 className="font-bold text-slate-900">{plan.name}</h3>
                                    </div>

                                    <ul className="space-y-2">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                                                <Check size={12} className="text-green-500 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                            <div className="text-xs text-slate-400">
                                <span className="font-medium text-slate-600">Dica:</span> Compare todos os planos na seção de preços.
                            </div>
                            <Link href="/register" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                Ver tabela completa <Zap size={12} />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
