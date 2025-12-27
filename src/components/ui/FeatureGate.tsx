'use client';

import { ReactNode } from 'react';
import { useSubscription } from '@/features/subscription/hooks/useSubscription';
import { FeatureKey } from '@/config/plans';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureGateProps {
    feature: FeatureKey;
    children: ReactNode;
    fallbackType?: 'blur' | 'hide' | 'lock_card';
    className?: string;
}

export default function FeatureGate({ feature, children, fallbackType = 'blur', className }: FeatureGateProps) {
    const { checkAccess, openUpgradeModal, loading } = useSubscription();

    if (loading) return null; // Or a skeleton

    const hasAccess = checkAccess(feature);

    if (hasAccess) {
        return <>{children}</>;
    }

    if (fallbackType === 'hide') {
        return null;
    }

    if (fallbackType === 'lock_card') {
        return (
            <div className={cn("p-8 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center justify-center text-center", className)}>
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <Lock size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Feature Exclusiva</h3>
                <p className="text-sm text-slate-500 max-w-xs mb-6">
                    Faça upgrade do seu plano para desbloquear este recurso e potencializar sua barbearia.
                </p>
                <Button onClick={openUpgradeModal} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Ver Planos
                </Button>
            </div>
        );
    }

    // Default: 'blur'
    return (
        <div className={cn("relative group", className)}>
            <div className="filter blur-md pointer-events-none select-none opacity-50">
                {children}
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl text-center border border-slate-200 transform transition-transform hover:scale-105">
                    <div className="mx-auto w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <Lock size={20} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">Recurso Bloqueado</h3>
                    <p className="text-xs text-slate-500 mb-4 max-w-[200px]">
                        Disponível a partir do plano Starter.
                    </p>
                    <Button onClick={openUpgradeModal} size="sm" className="w-full">
                        Fazer Upgrade
                    </Button>
                </div>
            </div>
        </div>
    );
}
