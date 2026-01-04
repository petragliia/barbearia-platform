
import { useState, useMemo } from 'react';
import { useClients } from '../hooks/useClients';
import { Client, SortField, SortOrder } from '../types';
import { Search, Loader2, ArrowUpDown, ArrowUp, ArrowDown, User } from 'lucide-react';
import { ClientHistoryModal } from './ClientHistoryModal';

export default function ClientList() {
    const { clients, loading } = useClients();
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<{ field: SortField, order: SortOrder }>({ field: 'lastVisit', order: 'desc' });
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const filteredClients = useMemo(() => {
        const result = clients.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search)
        );

        result.sort((a, b) => {
            let valA = a[sort.field];
            let valB = b[sort.field];

            // Normalize dates to numbers for comparison
            if (valA instanceof Date) valA = valA.getTime();
            if (valB instanceof Date) valB = valB.getTime();

            if (valA < valB) return sort.order === 'asc' ? -1 : 1;
            if (valA > valB) return sort.order === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [clients, search, sort]);

    const handleSort = (field: SortField) => {
        setSort(prev => ({
            field,
            order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
        }));
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sort.field !== field) return <ArrowUpDown size={14} className="text-slate-400 ml-1 inline" />;
        return sort.order === 'asc'
            ? <ArrowUp size={14} className="text-blue-600 ml-1 inline" />
            : <ArrowDown size={14} className="text-blue-600 ml-1 inline" />;
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-blue-600" /></div>;
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600/20 p-3 rounded-full text-blue-500">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Total de Clientes</p>
                            <h3 className="text-2xl font-bold text-slate-100">{clients.length}</h3>
                        </div>
                    </div>
                </div>
                {/* Could add more metrics like 'Active Clients', 'Churned', etc. */}
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <Search size={20} className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar por nome ou telefone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 outline-none text-slate-100 placeholder:text-slate-500 bg-transparent"
                />
            </div>

            {/* Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-950 border-b border-slate-800">
                            <tr>
                                <th
                                    className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-900 transition-colors"
                                    onClick={() => handleSort('name')}
                                >
                                    Cliente <SortIcon field="name" />
                                </th>
                                <th
                                    className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-900 transition-colors"
                                    onClick={() => handleSort('lastVisit')}
                                >
                                    Última Visita <SortIcon field="lastVisit" />
                                </th>
                                <th
                                    className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-900 transition-colors"
                                    onClick={() => handleSort('totalVisits')}
                                >
                                    Visitas <SortIcon field="totalVisits" />
                                </th>
                                <th
                                    className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-900 transition-colors"
                                    onClick={() => handleSort('totalSpend')}
                                >
                                    Total Gasto <SortIcon field="totalSpend" />
                                </th>
                                <th className="text-right py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                                                {client.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-100">{client.name}</p>
                                                <p className="text-xs text-slate-500">{client.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-400">
                                        {client.lastVisit.toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-400">
                                        {client.totalVisits}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-medium text-slate-200">
                                        R$ {client.totalSpend.toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => setSelectedClient(client)}
                                            className="text-blue-500 hover:text-blue-400 text-sm font-medium hover:underline"
                                        >
                                            Ver Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredClients.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500">
                                        Nenhum cliente encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ClientHistoryModal
                client={selectedClient}
                isOpen={!!selectedClient}
                onClose={() => setSelectedClient(null)}
            />
        </div>
    );
}
