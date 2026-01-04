'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Scissors, Minus, ArrowRight, Zap } from 'lucide-react';

export default function DemoShowcasePage() {
    const demos = [
        {
            id: 'urban',
            title: 'Moderno',
            description: 'Design vibrante com gradientes e elementos flutuantes.',
            icon: Sparkles,
            color: 'from-blue-600 to-purple-600',
            bg: 'bg-blue-950/20',
            border: 'hover:border-blue-500/50',
            button: 'bg-blue-600 hover:bg-blue-500',
            hoverShadow: 'group-hover:shadow-blue-500/20'
        },
        {
            id: 'classic',
            title: 'Clássico',
            description: 'Elegância atemporal com tons dourados e tipografia serifada.',
            icon: Scissors,
            color: 'from-amber-600 to-orange-600',
            bg: 'bg-amber-950/20',
            border: 'hover:border-amber-500/50',
            button: 'bg-amber-700 hover:bg-amber-600',
            hoverShadow: 'group-hover:shadow-amber-500/20'
        },
        {
            id: 'modern',
            title: 'Minimalista',
            description: 'Foco total no conteúdo. Design limpo e direto.',
            icon: Minus,
            color: 'from-slate-400 to-slate-600',
            bg: 'bg-slate-900/40',
            border: 'hover:border-white/50',
            button: 'bg-slate-100 text-slate-900 hover:bg-white',
            hoverShadow: 'group-hover:shadow-white/10'
        }
    ];

    return (
        <div className="min-h-screen md:h-screen w-full bg-[#020817] text-white font-sans overflow-x-hidden md:overflow-hidden flex flex-col relative selection:bg-blue-500/30 selection:text-blue-200">

            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] bg-indigo-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Header */}
            <header className="flex-none pt-12 pb-4 px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 text-[10px] font-bold tracking-widest mb-4 backdrop-blur-sm">
                        SHOWCASE
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                        Escolha um estilo
                    </h1>
                </motion.div>
            </header>

            {/* Grid Area */}
            <main className="flex-1 flex items-center justify-center px-6 py-4 relative z-10 w-full max-w-7xl mx-auto my-auto">
                <div className="grid md:grid-cols-3 gap-6 w-full h-auto md:h-full md:max-h-[600px] items-stretch pb-10 md:pb-0">
                    {demos.map((demo, index) => (
                        <motion.div
                            key={demo.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                            className={`group relative flex flex-col rounded-3xl border border-white/5 ${demo.bg} backdrop-blur-md transition-all duration-500 ${demo.border} hover:-translate-y-2 hover:shadow-2xl ${demo.hoverShadow}`}
                        >
                            {/* Card Content container with minimal padding adjustments for small screens */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col items-center text-center">
                                {/* Icon Halo */}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${demo.color} flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                    <demo.icon size={32} className="text-white drop-shadow-md" />
                                </div>

                                <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-white transition-colors duration-300">
                                    {demo.title}
                                </h2>

                                <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-xs group-hover:text-slate-300 transition-colors duration-300">
                                    {demo.description}
                                </p>

                                {/* Spacer to push button down */}
                                <div className="flex-grow"></div>

                                {/* Animated Button */}
                                <div className="w-full mt-6">
                                    <Link href={`/demo/${demo.id}`} className="block w-full">
                                        <button className={`w-full h-14 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 group-hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${demo.button} group-hover:shadow-lg group-hover:shadow-current/30 overflow-hidden relative`}>
                                            <span className="relative z-10 flex items-center gap-2">
                                                Visualizar
                                                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                                            </span>
                                            {/* Shine effect overlay */}
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Footer CTA */}
            <footer className="flex-none py-6 text-center relative z-10 bg-gradient-to-t from-[#020817] to-transparent">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="container mx-auto px-6"
                >
                    <Link href="/register" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300 group">
                        <span className="text-sm md:text-base">Gostou? Crie a sua igualzinha em 15 minutos</span>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                            <Zap size={14} className="fill-current text-white" />
                        </div>
                    </Link>
                </motion.div>
            </footer>
        </div>
    );
}
