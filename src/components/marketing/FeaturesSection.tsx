'use client';

import { motion } from 'framer-motion';
import { Store, Smartphone, Crown, TrendingUp, Zap, Shield } from 'lucide-react';

export default function FeaturesSection() {
    const features = [
        {
            icon: Store,
            title: "Lucre Mais",
            description: "Venda pomadas e shampoos diretamente pelo seu site. Aumente seu faturamento por cliente com sua loja online integrada.",
            delay: 0.1
        },
        {
            icon: Smartphone,
            title: "Zero Complexidade",
            description: "Editor 'arrasta e solta' projetado para celulares. Gerencie agendamentos, estoque e financeiro do seu bolso.",
            delay: 0.2
        },
        {
            icon: Crown,
            title: "Marca Premium",
            description: "Destaque-se dos concorrentes que só usam WhatsApp. Ofereça uma experiência VIP com site próprio e exclusivo.",
            delay: 0.3
        }
    ];

    return (
        <section id="features" className="w-full py-24 bg-slate-950 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5 }}
            className="group p-8 rounded-3xl bg-slate-900/50 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 hover:bg-slate-900/80 transition-all duration-300 shadow-xl"
        >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <Icon size={28} className="text-white" />
            </div>

            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                {title}
            </h3>

            <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                {description}
            </p>
        </motion.div>
    );
}
