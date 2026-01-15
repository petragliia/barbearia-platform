'use client';

import { usePathname } from 'next/navigation';
import { Menu, Search, Command } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from '@/features/dashboard/components/Sidebar';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { SubscriptionProvider } from '@/features/subscription/context/SubscriptionContext';
import UpgradeModal from '@/features/subscription/components/UpgradeModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
import { CommandMenu } from '@/features/dashboard/components/CommandMenu';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { getBarbershop } from '@/lib/services/barbershopService';

// Component to protect routes that require a barbershop to exist
function BarbershopCheck({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const check = async () => {
            if (!loading && user) {
                const shop = await getBarbershop(user.id);
                if (!shop) {
                    router.push('/setup');
                }
                setChecking(false);
            } else if (!loading && !user) {
                // Not authenticated handled by middleware usually, but safe to stop checking
                setChecking(false);
            }
        };
        check();
    }, [user, loading, router]);

    if (loading || checking) return null; // Or a loading spinner

    return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SubscriptionProvider>
            <DashboardContent>
                <BarbershopCheck>
                    {children}
                </BarbershopCheck>
            </DashboardContent>
            <UpgradeModal />
        </SubscriptionProvider>
    );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
    const { plan } = usePermission();

    const planLabel = {
        'FREE': 'Gratuito',
        'STARTER': 'Starter',
        'PRO': 'Pro',
        'BUSINESS': 'Business'
    }[plan] || plan;

    const pathname = usePathname();
    const isSiteEditor = pathname === '/dashboard/site';

    return (
        <div className="h-screen bg-slate-950 flex overflow-hidden">
            <CommandMenu open={isCommandMenuOpen} onOpenChange={setIsCommandMenuOpen} />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} hidden={isSiteEditor} />

            {/* Main Content */}
            <main className={cn(
                "flex-1 flex flex-col h-screen overflow-hidden relative",
                !isSiteEditor && "md:pl-64"
            )}>
                {/* Background Glow */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

                {/* Header - Hidden in Editor */}
                {!isSiteEditor && (
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="h-20 bg-slate-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 md:px-8 flex-shrink-0 z-20"
                    >
                        <div className="flex items-center gap-4">
                            <button
                                className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu size={24} />
                            </button>

                            {/* Global Search Bar */}
                            <div
                                className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 rounded-lg text-slate-400 w-64 hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                                onClick={() => setIsCommandMenuOpen(true)}
                            >
                                <Search size={16} className="group-hover:text-blue-400 transition-colors" />
                                <span className="text-sm">Buscar...</span>
                                <div className="ml-auto flex items-center gap-0.5 px-1.5 py-0.5 bg-black/20 rounded text-[10px] font-mono text-slate-500">
                                    <Command size={10} /> K
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 ml-auto">
                            <ThemeToggle />

                            <div className="flex items-center gap-3 pl-6 border-l border-white/5">
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-medium text-white">Barbearia Modelo</div>
                                    <div className="text-xs text-blue-400 font-medium">Plano {planLabel}</div>
                                </div>

                                {/* Avatar Ring */}
                                <div className="relative group cursor-pointer">
                                    <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
                                    <div className="relative w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-slate-300 font-bold border-2 border-slate-950 ring-2 ring-white/10 group-hover:ring-blue-500/50 transition-all">
                                        BM
                                    </div>
                                    {/* Status Dot */}
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </motion.header>
                )}

                {/* Page Content */}
                <div className={cn(
                    "flex-1 overflow-auto relative z-10",
                    isSiteEditor ? "p-0" : "p-6 md:p-8 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
                )}>
                    {children}
                </div>
            </main>
        </div>
    );
}
