'use client';

import { useAuth } from '@/features/auth/context/AuthContext';
import TeamManagement from '@/features/team/components/TeamManagement';
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

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Gestão de Equipe</h1>
                <p className="text-slate-400">Adicione, edite ou remova profissionais da sua barbearia.</p>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
                <TeamManagement barbershopId={user.uid} />
            </div>
        </div>
    );
}
