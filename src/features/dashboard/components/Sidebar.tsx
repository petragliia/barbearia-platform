'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Scissors, Settings, LogOut, X, Globe, Megaphone, ShoppingBag, Trophy, Lock, Users, CreditCard, Sparkles, Zap, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/features/subscription/hooks/useSubscription';
import { useAuth } from '@/features/auth/context/AuthContext';
import { motion } from 'framer-motion';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    hidden?: boolean;
}

export default function Sidebar({ isOpen, onClose, hidden }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { checkAccess: can, currentPlan: plan, loading: subLoading, openUpgradeModal } = useSubscription();
    const { logout } = useAuth();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // Define navigation items with optional permission check
    const navItems = [
        { name: 'Visão Geral', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Agendamentos', href: '/dashboard/appointments', icon: Calendar, feature: 'onlineBooking' as const },
        { name: 'Clientes', href: '/dashboard/clients', icon: Users },
        { name: 'Equipe', href: '/dashboard/team', icon: Users },
        { name: 'Serviços', href: '/dashboard/services', icon: Scissors },
        { name: 'Produtos', href: '/dashboard/products', icon: ShoppingBag, feature: 'products' as const },
        { name: 'Marketing', href: '/dashboard/marketing', icon: Megaphone, premium: true },
        { name: 'Campanhas', href: '/dashboard/campaigns', icon: MessageCircle, premium: true },
        { name: 'Fidelidade', href: '/dashboard/loyalty', icon: Trophy, feature: 'products' as const },
        { name: 'Seu Site', href: '/dashboard/site', icon: Globe },
        { name: 'Seu Plano', href: '/dashboard/plan', icon: CreditCard },
        { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
    ];


    if (subLoading) {
        return (
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-950/80 backdrop-blur-xl border-r border-white/5 flex flex-col p-4 space-y-4">
                <div className="h-10 w-3/4 bg-slate-800/50 rounded animate-pulse" />
                <div className="space-y-2">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-10 w-full bg-slate-800/50 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (hidden) return null;

    return (
        <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: isOpen ? 0 : (isMobile ? -300 : 0), opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 flex flex-col",
                // Glassmorphism & Borders
                "bg-slate-900 border-r border-white/5", // Removed backdrop-blur for performance test and made darker
                // Mobile behavior handling separately via animate prop, but keeping class for safety
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}
        >
            {/* Header */}
            <div className="h-20 flex items-center px-6 border-b border-white/5 flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent pointer-events-none" />
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-blue-400/30 z-10">
                    <Scissors size={18} />
                </div>
                <span className="font-bold text-lg text-white tracking-tight z-10">BarberSaaS</span>
                <button
                    className="ml-auto md:hidden text-slate-400 hover:text-white"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
                {navItems.map((item) => {
                    const isLocked = item.feature && !can(item.feature);
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    if (item.name === 'Marketing' && plan === 'FREE') return null;

                    if (isLocked) {
                        return (
                            <div
                                key={item.name}
                                onClick={openUpgradeModal}
                                className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-white/5 cursor-pointer relative transition-all duration-300"
                            >
                                <Icon size={18} className="group-hover:text-slate-400 transition-colors" />
                                <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                                <Lock size={14} className="ml-auto text-slate-600 group-hover:text-amber-500 transition-colors" />
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            id={item.name === 'Agendamentos' ? 'tour-dashboard-schedule' : undefined}
                            href={item.href}
                            className="block relative group"
                        >
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                                isActive
                                    ? "text-blue-400 bg-gradient-to-r from-blue-600/20 to-transparent"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                            )}>
                                {/* Active Glow Bar */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                                    />
                                )}

                                <Icon
                                    size={18}
                                    className={cn(
                                        "transition-all duration-300 z-10",
                                        isActive ? "text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]" : "group-hover:text-white"
                                    )}
                                />
                                <span className={cn(
                                    "transition-transform duration-300 z-10",
                                    "group-hover:translate-x-1"
                                )}>
                                    {item.name}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Plan Status */}
            <div className="p-4 border-t border-white/5 flex-shrink-0 bg-slate-900/40">
                <div className="mb-4 relative overflow-hidden rounded-xl border border-white/10 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />

                    {/* Premium Plan Style */}
                    {plan !== 'FREE' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 opacity-50" />
                    )}

                    <div className="relative p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                plan === 'FREE' ? "bg-slate-700 text-slate-300" : "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg"
                            )}>
                                {plan === 'FREE' ? <CreditCard size={16} /> : <Sparkles size={16} />}
                            </div>
                            {plan === 'FREE' && (
                                <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-600/30 uppercase tracking-wider">
                                    Free
                                </span>
                            )}
                        </div>

                        <div className="mb-3">
                            <p className="text-xs text-slate-400 font-medium">Plano Atual</p>
                            <p className="text-white font-bold text-sm tracking-wide">{plan === 'FREE' ? 'Gratuito' : plan}</p>
                        </div>

                        {plan === 'FREE' && (
                            <Button
                                onClick={openUpgradeModal}
                                size="sm"
                                className="w-full h-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-blue-900/20 text-xs font-semibold"
                            >
                                <Zap size={12} className="mr-1.5 fill-current" /> Fazer Upgrade
                            </Button>
                        )}
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    onClick={handleLogout}
                >
                    <LogOut size={18} className="mr-2" />
                    Sair da conta
                </Button>
            </div>
        </motion.aside>
    );
}
