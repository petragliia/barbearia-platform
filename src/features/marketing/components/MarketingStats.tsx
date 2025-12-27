import { Mail, MessageSquare, Users, TrendingUp } from 'lucide-react';

export default function MarketingStats() {
    const stats = [
        {
            label: 'Mensagens Enviadas (Mês)',
            value: '1,234',
            change: '+12%',
            icon: MessageSquare,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
        },
        {
            label: 'Taxa de Abertura',
            value: '94%',
            change: '+2.5%',
            icon: Mail,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
        },
        {
            label: 'Clientes Alcançados',
            value: '856',
            change: '+5%',
            icon: Users,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
        },
        {
            label: 'Retorno Estimado',
            value: 'R$ 4.5k',
            change: '+15%',
            icon: TrendingUp,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div key={index} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                <Icon className={stat.color} size={24} />
                            </div>
                            <span className="text-sm font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-medium mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-100">{stat.value}</h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
