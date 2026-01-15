'use client';

import { useAuth } from '@/features/auth/context/AuthContext';
import TeamManagement from '@/features/team/components/TeamManagement';
import { useSubscription } from '@/features/subscription/hooks/useSubscription';
import { UpgradeState } from '@/components/UpgradeState';
import { Loader2 } from 'lucide-react';

export default function TeamPage() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    const { checkAccess } = useSubscription();

    if (!checkAccess('team')) {
        return <UpgradeState featureName="Gestão de Equipe" description="Gerencie múltiplos profissionais, comissões e horários individuais." />;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Gestão de Equipe</h1>
                <p className="text-slate-400">Adicione, edite ou remova profissionais da sua barbearia.</p>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
                <TeamManagement barbershopId={user.id} />
            </div>
        </div>
    );
}
