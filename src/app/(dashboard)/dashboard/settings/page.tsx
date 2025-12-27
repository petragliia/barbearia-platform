'use client';

import { useAuth } from '@/features/auth/context/AuthContext';
import { Loader2 } from 'lucide-react';
import SettingsForm from '@/features/dashboard/components/SettingsForm';

export default function SettingsPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    if (!user) {
        return <div>Não autenticado.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Configurações</h1>
                <p className="text-slate-400 mt-1">Gerencie o perfil e a aparência da sua barbearia.</p>
            </div>

            <SettingsForm user={user} />
        </div>
    );
}
