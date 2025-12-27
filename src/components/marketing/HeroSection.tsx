'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, Zap, Play, BarChart3, Users, Scissors, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative w-full min-h-[90vh] bg-slate-950 overflow-hidden flex items-center pt-20 pb-20 lg:pt-32 lg:pb-32">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
                <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Column: Content */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-blue-400 text-xs font-bold tracking-wider py-1.5 px-4 rounded-full mb-8 backdrop-blur-md"
                        >
                            <Zap size={12} className="fill-blue-400" />
                            PLATAFORMA Nº1 PARA BARBEARIAS
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
                        >
                            Eleve o nível da sua{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                Barbearia
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg lg:text-xl text-slate-400 max-w-xl mb-10 leading-relaxed"
                        >
                            Gestão completa, agendamento online e venda de produtos em uma única plataforma premium. Deixe a tecnologia trabalhar enquanto você foca no corte.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                        >
                            <Link href="/register" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white h-14 px-8 rounded-full text-base font-semibold shadow-lg shadow-blue-900/40 hover:shadow-blue-600/60 transition-all flex items-center justify-center gap-2 group">
                                    Começar Agora <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <Link href="/demo" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white h-14 px-8 rounded-full text-base font-medium backdrop-blur-sm transition-all flex items-center justify-center gap-2">
                                    <Play size={16} className="fill-white" /> Ver Demonstração
                                </button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-10 flex items-center gap-4 text-sm text-slate-500"
                        >
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px] text-white font-bold">
                                        {i === 4 ? '+2k' : ''}
                                        {i !== 4 && <Users size={12} className="text-slate-400" />}
                                    </div>
                                ))}
                            </div>
                            <p>Confiança de +2.000 profissionais</p>
                        </motion.div>
                    </div>

                    {/* Right Column: 3D Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotateX: 20, rotateY: -20 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.2 }}
                        className="relative hidden lg:block perspective-1000"
                    >
                        {/* Glow Effect Behind */}
                        <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full transform translate-y-20"></div>

                        {/* Tilted Container - Using a subtle tilt manually via transform for the 'resting' state, 
                            but keeping it simple with CSS transforms for the '3D' feel requested */}
                        <div
                            className="relative bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden transform rotate-y-[-12deg] rotate-x-[5deg] hover:rotate-y-[0deg] hover:rotate-x-[0deg] transition-transform duration-700 ease-out preserve-3d"
                            style={{ transformStyle: 'preserve-3d', transform: 'perspective(1000px) rotateY(-12deg) rotateX(5deg)' }}
                        >
                            {/* Fake Browser Header */}
                            <div className="h-10 bg-slate-950 border-b border-white/10 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                <div className="ml-4 h-6 w-96 bg-slate-800/50 rounded-md flex items-center px-3 text-[10px] text-slate-500 font-mono">
                                    barbersaas.com/dashboard/analytics
                                </div>
                            </div>

                            {/* Dashboard Mockup Content */}
                            <div className="flex bg-slate-950 h-[450px]">
                                {/* Sidebar */}
                                <div className="w-16 lg:w-48 bg-slate-900 border-r border-white/5 p-4 flex flex-col gap-4">
                                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Scissors size={16} className="text-white" />
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        <div className="h-8 w-full bg-white/10 rounded-md flex items-center gap-3 px-3">
                                            <BarChart3 size={14} className="text-blue-400" />
                                            <div className="h-2 w-16 bg-white/20 rounded-full hidden lg:block"></div>
                                        </div>
                                        <div className="h-8 w-full hover:bg-white/5 rounded-md flex items-center gap-3 px-3 transition-colors">
                                            <Calendar size={14} className="text-slate-500" />
                                            <div className="h-2 w-20 bg-slate-800 rounded-full hidden lg:block"></div>
                                        </div>
                                        <div className="h-8 w-full hover:bg-white/5 rounded-md flex items-center gap-3 px-3 transition-colors">
                                            <Users size={14} className="text-slate-500" />
                                            <div className="h-2 w-12 bg-slate-800 rounded-full hidden lg:block"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Area */}
                                <div className="flex-1 p-6 overflow-hidden">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <div className="h-4 w-32 bg-slate-800 rounded-full mb-2"></div>
                                            <div className="h-8 w-48 bg-white/10 rounded-md"></div>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10"></div>
                                    </div>

                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-slate-900 border border-white/5 p-4 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                                    <span className="text-green-500 text-xs">$</span>
                                                </div>
                                                <div className="h-3 w-12 bg-slate-800 rounded-full"></div>
                                            </div>
                                            <div className="h-6 w-24 bg-white/10 rounded-md mt-2"></div>
                                        </div>
                                        <div className="bg-slate-900 border border-white/5 p-4 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                    <Users size={14} className="text-blue-500" />
                                                </div>
                                                <div className="h-3 w-16 bg-slate-800 rounded-full"></div>
                                            </div>
                                            <div className="h-6 w-20 bg-white/10 rounded-md mt-2"></div>
                                        </div>
                                    </div>

                                    {/* Chart Placeholder */}
                                    <div className="w-full h-40 bg-slate-900 border border-white/5 rounded-xl p-4 flex items-end gap-2">
                                        {[40, 70, 45, 90, 60, 80, 50, 75, 60, 95].map((h, i) => (
                                            <div key={i} className="flex-1 bg-gradient-to-t from-blue-600/20 to-blue-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating Glass Card Over Mockup */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute -right-6 bottom-12 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl w-48 z-20"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                                        <Check size={14} className="text-black font-bold" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-400">Novo Agendamento</div>
                                        <div className="text-xs font-bold text-white">João Silva</div>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-green-500"></div>
                                </div>
                            </motion.div>

                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
