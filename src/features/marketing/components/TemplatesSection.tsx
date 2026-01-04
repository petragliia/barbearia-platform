'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function TemplatesSection() {
    return (
        <section id="templates" className="relative w-full py-20 lg:py-32 bg-slate-950 overflow-hidden">
            {/* Background Effects (Subtle/Dark) */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Escolha seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Estilo</span>
                        </h2>
                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                            Três designs exclusivos e profissionais, otimizados para converter visitantes em clientes fiéis.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1: Classic Gentleman */}
                    <TemplateCard
                        title="Classic Gentleman"
                        description="Elegância atemporal para barbearias tradicionais."
                        image="/img/classicgentleman.png"
                        tags={['Vintage', 'Premium', 'Gold']}
                        demoLink="/demo/classic"
                        delay={0.1}
                    />

                    {/* Card 2: Modern Minimalist */}
                    <TemplateCard
                        title="Modern Minimalist"
                        description="Design limpo e focado no essencial."
                        image="/img/modernminimalist.png"
                        tags={['Clean', 'Dark Mode', 'Glass']}
                        isRecommended
                        demoLink="/demo/modern"
                        delay={0.2}
                    />

                    {/* Card 3: Urban Style */}
                    <TemplateCard
                        title="Urban Soul"
                        description="Estilo industrial e autêntico para quem tem atitude."
                        image="/img/urbanstyle.png"
                        tags={['Industrial', 'Bold', 'Street']}
                        demoLink="/demo/urban"
                        delay={0.3}
                    />
                </div>
            </div>
        </section>
    );
}

function TemplateCard({
    title,
    description,
    image,
    tags,
    isRecommended,
    demoLink,
    delay
}: {
    title: string,
    description: string,
    image: string,
    tags: string[],
    isRecommended?: boolean,
    demoLink: string,
    delay: number
}) {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay }}
            whileHover={{ y: -10 }}
            onClick={() => router.push(demoLink)}
            className="group relative bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col cursor-pointer hover:border-blue-500/50 hover:shadow-blue-900/20"
        >
            {isRecommended && (
                <div className="absolute top-4 right-4 z-20 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 border border-blue-400/20">
                    <Star size={10} className="fill-white" /> POPULAR
                </div>
            )}

            <div className="aspect-[4/3] overflow-hidden bg-slate-800 relative">
                <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />

                {/* Gradient Overlay for Text Readability if needed, mostly aesthetic here */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Hover Overlay with Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-slate-950/60 backdrop-blur-[2px]">
                    <Button className="rounded-full shadow-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-6 text-base transform translate-y-4 group-hover:translate-y-0 transition-all border border-blue-400/20">
                        <ExternalLink size={18} className="mr-2" /> Ver Demo
                    </Button>
                </div>
            </div>

            <div className="p-8 flex flex-col flex-grow relative bg-slate-900/50 backdrop-blur-sm">
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag, i) => (
                        <span key={i} className="bg-white/5 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg border border-white/5 group-hover:border-blue-500/30 group-hover:text-blue-200 transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
                <p className="text-slate-400 text-sm mb-8 flex-grow leading-relaxed border-b border-white/5 pb-6">{description}</p>

                <div className="mt-auto">
                    <Link
                        href="/register"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-between text-white font-semibold text-sm group/link p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <span>Começar com este</span>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/link:bg-blue-600 transition-all">
                            <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                        </div>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
