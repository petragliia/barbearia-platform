'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { Users, Calendar, DollarSign, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, format, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardMetrics {
    appointmentsToday: number;
    revenueMonth: number;
    weeklyData: { name: string; appointments: number }[];
    recentAppointments: any[];
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        appointmentsToday: 0,
        revenueMonth: 0,
        weeklyData: [],
        recentAppointments: []
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            if (!user) return;

            try {
                const now = new Date();
                const todayStart = startOfDay(now);
                const todayEnd = endOfDay(now);
                const monthStart = startOfMonth(now);
                const monthEnd = endOfMonth(now);
                const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
                const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

                const appointmentsRef = collection(db, 'appointments');

                // 1. Fetch Today's Appointments
                const todayQuery = query(
                    appointmentsRef,
                    where('barbershopId', '==', user.uid),
                    where('date', '>=', Timestamp.fromDate(todayStart)),
                    where('date', '<=', Timestamp.fromDate(todayEnd))
                );
                const todaySnap = await getDocs(todayQuery);
                const appointmentsToday = todaySnap.size;

                // 2. Fetch Month's Revenue (Estimated)
                const monthQuery = query(
                    appointmentsRef,
                    where('barbershopId', '==', user.uid),
                    where('date', '>=', Timestamp.fromDate(monthStart)),
                    where('date', '<=', Timestamp.fromDate(monthEnd))
                );
                const monthSnap = await getDocs(monthQuery);
                const revenueMonth = monthSnap.docs.reduce((acc, doc) => {
                    const data = doc.data();
                    return acc + (data.price || 0);
                }, 0);

                // 3. Fetch Weekly Data for Chart
                const weekQuery = query(
                    appointmentsRef,
                    where('barbershopId', '==', user.uid),
                    where('date', '>=', Timestamp.fromDate(weekStart)),
                    where('date', '<=', Timestamp.fromDate(weekEnd))
                );
                const weekSnap = await getDocs(weekQuery);

                const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
                const weeklyData = daysOfWeek.map((day, index) => {
                    // Calculate date for this day of week
                    const currentDay = new Date(weekStart);
                    currentDay.setDate(weekStart.getDate() + index);

                    const count = weekSnap.docs.filter(doc =>
                        isSameDay(doc.data().date.toDate(), currentDay)
                    ).length;

                    return { name: day, appointments: count };
                });

                // 4. Fetch Recent/Upcoming Appointments
                const recentQuery = query(
                    appointmentsRef,
                    where('barbershopId', '==', user.uid),
                    where('date', '>=', Timestamp.fromDate(now)), // Only future
                    orderBy('date', 'asc'),
                    limit(5)
                );
                const recentSnap = await getDocs(recentQuery);
                const recentAppointments = recentSnap.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        client: data.customerName,
                        service: data.serviceName,
                        time: format(data.date.toDate(), 'HH:mm'),
                        date: format(data.date.toDate(), 'dd/MM'),
                        status: data.status === 'pending' ? 'Pendente' : 'Confirmado' // Simple mapping
                    };
                });

                setMetrics({
                    appointmentsToday,
                    revenueMonth,
                    weeklyData,
                    recentAppointments
                });

            } catch (error) {
                console.error("Error fetching dashboard metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Visão Geral</h1>
                <p className="text-slate-500">Acompanhe o desempenho da sua barbearia.</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <Users size={24} />
                        </div>
                        <span className="flex items-center text-slate-400 text-sm font-medium bg-slate-50 px-2 py-1 rounded-full">
                            Mock
                        </span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Visitas no Site</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-1">1,234</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                            <Calendar size={24} />
                        </div>
                        <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp size={14} className="mr-1" /> Hoje
                        </span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Agendamentos Hoje</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{metrics.appointmentsToday}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-lg text-green-600">
                            <DollarSign size={24} />
                        </div>
                        <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp size={14} className="mr-1" /> Este Mês
                        </span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Faturamento Estimado</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-1">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.revenueMonth)}
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-w-0">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Agendamentos da Semana</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar
                                    dataKey="appointments"
                                    fill="#0f172a"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Clients List */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Próximos Clientes</h2>
                    </div>
                    <div className="space-y-4">
                        {metrics.recentAppointments.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">Nenhum agendamento futuro.</p>
                        ) : (
                            metrics.recentAppointments.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
                                            {apt.client.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{apt.client}</h4>
                                            <p className="text-xs text-slate-500">{apt.service}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-slate-900 font-medium text-sm justify-end">
                                            <Clock size={14} className="text-slate-400" />
                                            {apt.time}
                                        </div>
                                        <div className="text-xs text-slate-400">{apt.date}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
