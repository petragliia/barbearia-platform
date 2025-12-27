'use client';

import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PricingSection() {
    return (
        <section id="pricing" className="relative w-full py-24 bg-slate-950 overflow-hidden">
            {/* Background Effects - "Living Scenario" */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Subtle Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

                {/* Floating Glows/Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"
                />

                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, 50, 0]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"
                />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Planos Simples e Transparentes</h2>
                        <p className="text-slate-400 text-lg">Escolha o plano ideal para o momento da sua barbearia.</p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Starter Plan */}
                    <PricingCard
                        title="Starter"
                        description="Para quem está começando."
                        price="49"
                        features={[
                            "Site Profissional",
                            "Agendamento via WhatsApp",
                            "Hospedagem Inclusa"
                        ]}
                        buttonText="Começar Agora"
                        buttonHref="/register?plan=starter"
                        delay={0.1}
                    />

                    {/* Pro Plan - Highlighted */}
                    <PricingCard
                        title="Pro"
                        description="Para barbearias em crescimento."
                        price="89"
                        features={[
                            "Tudo do Starter",
                            "Agendamento Online",
                            "Gestão de Clientes",
                            "Lembretes Automáticos"
                        ]}
                        buttonText="Assinar Pro"
                        buttonHref="/register?plan=pro"
                        isPopular
                        delay={0.2}
                    />

                    {/* Empire Plan */}
                    <PricingCard
                        title="Empire"
                        description="Para redes e franquias."
                        price="149"
                        features={[
                            "Tudo do Pro",
                            "Múltiplos Profissionais",
                            "Relatórios Avançados",
                            "Suporte Prioritário"
                        ]}
                        buttonText="Falar com Vendas"
                        buttonHref="/register?plan=empire"
                        delay={0.3}
                    />
                </div>
            </div>
        </section>
    );
}

function PricingCard({
    title,
    description,
    price,
    features,
    buttonText,
    buttonHref,
    isPopular,
    delay
}: {
    title: string,
    description: string,
    price: string,
    features: string[],
    buttonText: string,
    buttonHref: string,
    isPopular?: boolean,
    delay: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay }}
            whileHover={{ y: -8 }}
            className={`relative p-8 rounded-3xl flex flex-col border transition-all duration-300 ${isPopular
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-blue-500/50 shadow-2xl shadow-blue-900/20 z-10 scale-105 md:scale-110'
                    : 'bg-slate-900/40 border-white/10 hover:bg-slate-900/60 hover:border-white/20'
                }`}
        >
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider">
                    <Star size={10} className="fill-white" /> Mais Popular
                </div>
            )}

            <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-slate-200'}`}>
                    {title}
                </h3>
                <p className="text-slate-400 text-sm h-10">{description}</p>
            </div>

            <div className="mb-8">
                <div className="flex items-baseline text-white">
                    <span className="text-sm font-medium opacity-50 mr-1">R$</span>
                    <span className="text-5xl font-bold tracking-tighter">{price}</span>
                    <span className="text-sm font-medium text-slate-500 ml-1">/mês</span>
                </div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                        <div className={`rounded-full p-1 ${isPopular ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                            <Check size={12} strokeWidth={3} />
                        </div>
                        {feature}
                    </li>
                ))}
            </ul>

            <Link href={buttonHref} className="mt-auto">
                <Button
                    className={`w-full py-6 text-base font-bold rounded-xl transition-all duration-300 shadow-lg ${isPopular
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25 hover:shadow-blue-600/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/5'
                        }`}
                >
                    {buttonText}
                </Button>
            </Link>
        </motion.div>
    );
}
