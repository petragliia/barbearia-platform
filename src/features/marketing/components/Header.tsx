'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Scissors } from 'lucide-react';
import MobileMenu from '@/features/marketing/components/MobileMenu';
import FeaturesMenu from '@/features/marketing/components/FeaturesMenu';

export default function Header() {
    return (
        <header className="sticky top-0 left-0 right-0 z-50 bg-[#020817]/80 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        <Scissors size={18} />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">BarberSaaS</span>
                </div>

                {/* Nav Links - Hidden on mobile, visible on desktop */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <FeaturesMenu />
                    <Link href="#templates" className="hover:text-white transition-colors">Modelos</Link>
                    <Link href="#pricing" className="hover:text-white transition-colors">Preços</Link>
                </nav>

                {/* CTA */}
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white hidden sm:block">
                        Entrar
                    </Link>
                    <Link href="/register" className="hidden sm:block">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-900/40 min-h-[44px]">
                            Testar Grátis
                        </Button>
                    </Link>
                    {/* Mobile Menu Toggle */}
                    <MobileMenu />
                </div>
            </div>
        </header>
    );
}
