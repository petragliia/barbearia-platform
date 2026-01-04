'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Scissors, Settings, LogOut, X, Globe, Megaphone, ShoppingBag, Trophy, Lock, Users, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/features/subscription/hooks/useSubscription';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    hidden?: boolean;
}

export default function Sidebar({ isOpen, onClose, hidden }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { checkAccess: can, currentPlan: plan, loading, openUpgradeModal } = useSubscription();

    const handleLogout = async () => {
        try {
            await signOut(auth);
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
        { name: 'Marketing', href: '/dashboard/marketing', icon: Megaphone, premium: true }, // Keeping marketing separate logic for now or mapped to a feature
        { name: 'Fidelidade', href: '/dashboard/loyalty', icon: Trophy, feature: 'products' as const }, // Assuming loyalty is bundled with business/products for now or define new feature
        { name: 'Seu Site', href: '/dashboard/site', icon: Globe },
        { name: 'Seu Plano', href: '/dashboard/plan', icon: CreditCard },
        { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
    ];


    if (loading || hidden) return null; // Or a skeleton

    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="h-16 flex items-center px-6 border-b border-slate-800 flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-lg shadow-blue-900/20">
                    <Scissors size={18} />
                </div>
                <span className="font-bold text-lg text-white tracking-tight">BarberSaaS</span>
                <button
                    className="ml-auto md:hidden text-slate-400 hover:text-white"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                {navItems.map((item) => {
                    // Check permissions
                    if (item.feature && !can(item.feature)) {
                        return (
                            <div
                                key={item.name}
                                onClick={openUpgradeModal}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 cursor-pointer group relative transition-all"
                            >
                                <item.icon size={20} />
                                {item.name}
                                <Lock size={14} className="ml-auto text-slate-600 group-hover:text-amber-500 transition-colors" />
                            </div>
                        );
                    }

                    if (item.name === 'Marketing' && plan === 'FREE') return null;

                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            id={item.name === 'Agendamentos' ? 'tour-dashboard-schedule' : undefined}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400 shadow-sm border border-blue-600/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <Icon size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800 flex-shrink-0">
                <div className="mb-4 px-3 py-3 bg-slate-950/50 border border-slate-800 rounded-xl">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Seu Plano</p>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{plan === 'FREE' ? 'Gratuito' : plan}</span>
                        {plan === 'FREE' && (
                            <Link href="/dashboard/plan" className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-medium">
                                Upgrade
                            </Link>
                        )}
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={handleLogout}
                >
                    <LogOut size={20} className="mr-2" />
                    Sair
                </Button>
            </div>
        </aside>
    );
}
