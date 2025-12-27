'use client';

import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Scissors, Settings, LogOut, Menu, X, Globe, Megaphone } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Sidebar from '@/features/dashboard/components/Sidebar';
import { usePermission } from '@/hooks/usePermission';
import { SubscriptionProvider } from '@/features/subscription/context/SubscriptionContext';
import UpgradeModal from '@/features/subscription/components/UpgradeModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SubscriptionProvider>
            <DashboardContent>
                {children}
            </DashboardContent>
            <UpgradeModal />
        </SubscriptionProvider>
    );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} hidden={isSiteEditor} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header - Hidden in Editor */}
                {!isSiteEditor && (
                    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 md:px-8 flex-shrink-0">
                        <button
                            className="md:hidden p-2 -ml-2 text-slate-400"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>

                        <div className="flex items-center gap-4 ml-auto">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-white">Barbearia Modelo</div>
                                <div className="text-xs text-slate-400">Plano {planLabel}</div>
                            </div>
                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-bold border border-slate-700">
                                BM
                            </div>
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <div className={`flex-1 overflow-auto ${isSiteEditor ? 'p-0' : 'p-6 md:p-8'}`}>
                    {children}
                </div>
            </main>
        </div>
    );
}
