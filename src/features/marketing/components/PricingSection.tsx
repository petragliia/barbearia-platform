'use client';

import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { clsx } from 'clsx';

export default function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(false);

    const plans = [
        {
            name: 'Iniciante',
            subtitle: 'Presença Digital',
            priceMonthly: 29.90,
            priceAnnual: 29.90 * 10, // 2 months free
            features: [
                'Site Profissional (Modelos Básicos)',
                'Link direto para seu WhatsApp',
                'Hospedagem Inclusa',
                'Editor de Informações'
            ],
            cta: 'Começar Agora',
            href: '/register',
            popular: false,
            checkColor: 'text-gray-400'
        },
        {
            name: 'Profissional',
            subtitle: 'Automação Total',
            priceMonthly: 59.90,
            priceAnnual: 59.90 * 10,
            features: [
                'Tudo do Iniciante, mais:',
                'Agendamento Online Automático',
                'Lembretes via WhatsApp',
                'Domínio Próprio Conectado',
                'Painel de Estatísticas',
                'Modelos Premium (3D e Motion)'
            ],
            cta: 'Começar Teste Grátis',
            href: '/register?plan=pro',
            popular: true,
            checkColor: 'text-green-500'
        },
        {
            name: 'Império',
            subtitle: 'Gestão de Equipe',
            priceMonthly: 99.90,
            priceAnnual: 99.90 * 10,
            features: [
                'Tudo do Profissional, mais:',
                'Gestão de Múltiplos Barbeiros',
                'Cálculo de Comissões',
                'Histórico de Clientes (CRM)',
                'Suporte VIP Prioritário'
            ],
            cta: 'Falar com Vendas',
            href: '/contact',
            popular: false,
            checkColor: 'text-yellow-500',
            dark: true
        }
    ];

    return (
        <section id="pricing" className="py-24 px-6 bg-white">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Planos simples e transparentes</h2>
                    <p className="text-gray-500 mb-8">Escolha o melhor plano para o seu negócio.</p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={clsx("text-sm font-medium", !isAnnual ? "text-gray-900" : "text-gray-500")}>Mensal</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative w-14 h-8 bg-gray-200 rounded-full p-1 transition-colors hover:bg-gray-300 focus:outline-none"
                        >
                            <div
                                className={clsx(
                                    "w-6 h-6 bg-white rounded-full shadow-sm transition-transform",
                                    isAnnual ? "translate-x-6" : "translate-x-0"
                                )}
                            />
                        </button>
                        <span className={clsx("text-sm font-medium", isAnnual ? "text-gray-900" : "text-gray-500")}>
                            Anual <span className="text-green-600 font-bold text-xs ml-1 bg-green-50 px-2 py-0.5 rounded-full">2 Meses Grátis</span>
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-center">
                    {plans.map((plan) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className={clsx(
                                "relative p-8 rounded-2xl border transition-all flex flex-col h-full",
                                plan.popular
                                    ? "bg-white border-blue-600 shadow-2xl scale-105 z-10"
                                    : plan.dark
                                        ? "bg-slate-900 border-slate-800 text-white"
                                        : "bg-white border-gray-200 hover:border-gray-300"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-blue-600/30">
                                    Mais Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={clsx("text-xl font-bold mb-1", plan.dark ? "text-white" : "text-gray-900")}>{plan.name}</h3>
                                <p className={clsx("text-sm mb-6", plan.dark ? "text-gray-400" : "text-gray-500")}>{plan.subtitle}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className={clsx("text-4xl font-bold", plan.dark ? "text-white" : "text-gray-900")}>
                                        R$ {isAnnual ? (plan.priceAnnual / 12).toFixed(2).replace('.', ',') : plan.priceMonthly.toFixed(2).replace('.', ',')}
                                    </span>
                                    <span className={clsx(plan.dark ? "text-gray-500" : "text-gray-500")}>/mês</span>
                                </div>
                                {isAnnual && (
                                    <p className="text-xs text-green-500 mt-2 font-medium">
                                        Faturado R$ {plan.priceAnnual.toFixed(2).replace('.', ',')} anualmente
                                    </p>
                                )}
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className={clsx("flex items-start gap-3 text-sm", plan.dark ? "text-gray-300" : "text-gray-600")}>
                                        <Check size={18} className={clsx("shrink-0", plan.checkColor)} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.href}
                                className={clsx(
                                    "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors",
                                    plan.popular
                                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                                        : plan.dark
                                            ? "border border-slate-700 text-white hover:bg-slate-800"
                                            : "border border-gray-200 text-gray-900 hover:bg-gray-50"
                                )}
                            >
                                {plan.cta}
                                {plan.popular && <ArrowRight size={18} />}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
