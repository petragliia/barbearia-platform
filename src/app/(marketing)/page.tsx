'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Scissors, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import GreetingFeature from '@/components/features/GreetingFeature';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <GreetingFeature />
            {/* 1. Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <Scissors size={18} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">BarberSaaS</span>
                    </div>

                    {/* Nav Links - Hidden on mobile, visible on desktop */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <Link href="#features" className="hover:text-blue-600 transition-colors">Funcionalidades</Link>
                        <Link href="#templates" className="hover:text-blue-600 transition-colors">Modelos</Link>
                        <Link href="#pricing" className="hover:text-blue-600 transition-colors">Preços</Link>
                    </nav>

                    {/* CTA */}
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 hidden sm:block">
                            Entrar
                        </Link>
                        <Link href="/register">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                                Começar Grátis
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20">
                {/* 2. Hero Section */}
                <section className="container mx-auto px-6 text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-bold tracking-wider py-1.5 px-4 rounded-full mb-8"
                    >
                        <Zap size={12} className="fill-blue-600" />
                        PARA BARBEARIAS MODERNAS
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.1]"
                    >
                        O site da sua barbearia <br className="hidden md:block" />
                        <span className="text-blue-600">pronto em segundos.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Escolha um design premium, personalize com seus dados e comece a receber agendamentos online hoje mesmo. Sem código, sem complicação.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/register">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 rounded-full text-base font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all w-full sm:w-auto">
                                Criar meu site agora <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </Link>
                        <Link href="#templates">
                            <Button variant="outline" size="lg" className="bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 h-14 px-8 rounded-full text-base font-semibold w-full sm:w-auto">
                                Ver modelos
                            </Button>
                        </Link>
                    </motion.div>
                </section>

                {/* 3. Choose Your Style Section */}
                <section id="templates" className="container mx-auto px-6 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Escolha seu estilo</h2>
                        <p className="text-slate-500 text-lg">Três designs exclusivos otimizados para conversão.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1: Classic Gentleman */}
                        <TemplateCard
                            title="Classic Gentleman"
                            description="Elegância atemporal para barbearias tradicionais."
                            image="/img/classicgentleman.png"
                            tags={['Vintage', 'Premium', 'Gold']}
                            demoLink="/demo/classic"
                        />

                        {/* Card 2: Modern Minimalist */}
                        <TemplateCard
                            title="Modern Minimalist"
                            description="Design limpo e focado no essencial."
                            image="/img/modernminimalist.png"
                            tags={['Clean', 'Dark Mode', 'Glass']}
                            isRecommended
                            demoLink="/demo/modern"
                        />

                        {/* Card 3: Urban Style */}
                        <TemplateCard
                            title="Urban Soul"
                            description="Estilo industrial e autêntico para quem tem atitude."
                            image="/img/urbanstyle.png"
                            tags={['Industrial', 'Bold', 'Street']}
                            demoLink="/demo/urban"
                        />
                    </div>
                </section>

                {/* 4. Pricing Section */}
                <section id="pricing" className="container mx-auto px-6 py-20 bg-slate-50">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Planos Simples e Transparentes</h2>
                        <p className="text-slate-500 text-lg">Escolha o plano ideal para o momento da sua barbearia.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Plan 1: Starter */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
                            <p className="text-slate-500 text-sm mb-6">Para quem está começando.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-slate-900">R$ 49</span>
                                <span className="text-slate-500">/mês</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check size={16} className="text-green-500" /> Site Profissional
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check size={16} className="text-green-500" /> Agendamento via WhatsApp
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check size={16} className="text-green-500" /> Hospedagem Inclusa
                                </li>
                            </ul>
                            <Link href="/register?plan=starter">
                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-full">
                                    Começar Agora
                                </Button>
                            </Link>
                        </div>

                        {/* Plan 2: Pro */}
                        <div className="bg-white p-8 rounded-2xl border-2 border-blue-600 shadow-xl relative transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                MAIS POPULAR
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Pro</h3>
                            <p className="text-slate-500 text-sm mb-6">Para barbearias em crescimento.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-slate-900">R$ 89</span>
                                <span className="text-slate-500">/mês</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check size={16} className="text-green-500" /> Tudo do Starter
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check size={16} className="text-green-500" /> Agendamento Online
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check size={16} className="text-green-500" /> Gestão de Clientes
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check size={16} className="text-green-500" /> Lembretes Automáticos
                                </li>
                            </ul>
                            <Link href="/register?plan=pro">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full h-12 text-lg">
                                    Assinar Pro
                                </Button>
                            </Link>
                        </div>

                        {/* Plan 3: Empire */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Empire</h3>
                            <p className="text-slate-500 text-sm mb-6">Para redes e franquias.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-slate-900">R$ 149</span>
                                <span className="text-slate-500">/mês</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check size={16} className="text-green-500" /> Tudo do Pro
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check size={16} className="text-green-500" /> Múltiplos Profissionais
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check size={16} className="text-green-500" /> Relatórios Avançados
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check size={16} className="text-green-500" /> Suporte Prioritário
                                </li>
                            </ul>
                            <Link href="/register?plan=empire">
                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-full">
                                    Falar com Vendas
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* 4. Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 py-12">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white">
                                    <Scissors size={14} />
                                </div>
                                <span className="text-lg font-bold text-slate-900">BarberSaaS</span>
                            </div>
                            <p className="text-slate-500 max-w-sm">
                                A plataforma completa para barbearias que querem crescer. Agendamento, gestão e marketing em um só lugar.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Produto</h4>
                            <ul className="space-y-2 text-slate-500 text-sm">
                                <li><a href="#features" className="hover:text-blue-600">Funcionalidades</a></li>
                                <li><a href="#pricing" className="hover:text-blue-600">Preços</a></li>
                                <li><a href="#templates" className="hover:text-blue-600">Modelos</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                            <ul className="space-y-2 text-slate-500 text-sm">
                                <li><Link href="/legal" className="hover:text-blue-600">Termos e Privacidade</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
                        <p>© 2024 BarberSaaS. Todos os direitos reservados.</p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-blue-600">Instagram</a>
                            <a href="#" className="hover:text-blue-600">Twitter</a>
                            <a href="#" className="hover:text-blue-600">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function TemplateCard({ title, description, image, tags, isRecommended, demoLink }: { title: string, description: string, image: string, tags: string[], isRecommended?: boolean, demoLink: string }) {
    const router = useRouter();

    return (
        <motion.div
            whileHover={{ y: -10 }}
            onClick={() => router.push(demoLink)}
            className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
        >
            {isRecommended && (
                <div className="absolute top-4 right-4 z-10 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Star size={10} className="fill-white" /> RECOMENDADO
                </div>
            )}

            <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />

                {/* Hover Overlay with Demo Button - Visual Cue */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                    <Button className="rounded-full shadow-xl pointer-events-none bg-blue-600 text-white hover:bg-blue-700 font-bold px-8 py-6 text-lg transform hover:scale-105 transition-all">
                        Ver Demonstração
                    </Button>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex gap-2 mb-4">
                    {tags.map((tag, i) => (
                        <span key={i} className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-0.5 rounded border border-slate-200">
                            {tag}
                        </span>
                    ))}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm mb-6 flex-grow">{description}</p>

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-auto"
                >
                    <Link href="/register" className="inline-flex items-center text-blue-600 font-semibold text-sm hover:gap-2 transition-all group-hover:text-blue-700">
                        Escolher este modelo <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
