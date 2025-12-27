
'use client';

import ClientList from '@/features/crm/components/ClientList';

export default function ClientsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-100">Meus Clientes</h1>
                <p className="text-slate-400">Gerencie sua base de clientes, veja histórico e métricas.</p>
            </div>
            <ClientList />
        </div>
    );
}
