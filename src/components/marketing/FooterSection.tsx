'use client';

import { Scissors, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';

export default function FooterSection() {
    return (
        <footer className="w-full bg-slate-950 border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
            {/* Background Subtle Glows */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                <Scissors size={16} />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">BarberSaaS</span>
                        </div>
                        <p className="text-slate-400 max-w-sm leading-relaxed text-sm">
                            A plataforma completa para barbearias que querem crescer. Agendamento, gestão e marketing em um só lugar, com design premium.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Produto</h4>
                        <ul className="space-y-4 text-slate-400 text-sm">
                            <li><a href="#features" className="hover:text-blue-400 transition-colors">Funcionalidades</a></li>
                            <li><a href="#templates" className="hover:text-blue-400 transition-colors">Modelos</a></li>
                            <li><a href="#pricing" className="hover:text-blue-400 transition-colors">Preços</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-4 text-slate-400 text-sm">
                            <li><Link href="/legal" className="hover:text-blue-400 transition-colors">Termos de Uso</Link></li>
                            <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacidade</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© 2024 BarberSaaS. Todos os direitos reservados.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors"><Instagram size={18} /></a>
                        <a href="#" className="hover:text-white transition-colors"><Twitter size={18} /></a>
                        <a href="#" className="hover:text-white transition-colors"><Linkedin size={18} /></a>
                        <a href="#" className="hover:text-white transition-colors"><Github size={18} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
