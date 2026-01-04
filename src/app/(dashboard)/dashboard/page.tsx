'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import {
    Users, Calendar, DollarSign, Loader2,
    Receipt, UserPlus, Package,
    Megaphone, Bell, Plus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, format, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { Product, Service } from '@/types/barbershop';
import BookingModal from '@/features/booking/components/BookingModal';
import { Barber } from '@/features/team/types';
import ShareBarbershopCard from '@/features/dashboard/components/ShareBarbershopCard';

interface DashboardMetrics {
    appointmentsToday: number;
    appointmentsPending: number;
    revenueMonth: number;
    revenueToday: number;
    weeklyData: { name: string; appointments: number }[];
    recentAppointments: any[];
    pageViews: number;
    products: Product[];
    services: Service[];
    appointmentsMonthCount: number;
    barbersStats: {
        id: string;
        name: string;
        photoUrl?: string;
        appointments: number;
        revenue: number;
    }[];
    uniqueClientsMonth: number;
    slug?: string;
}

import { useTour } from '@/hooks/useTour';

export default function DashboardPage() {
    const { user } = useAuth();
    useTour('dashboard'); // Start dashboard tour

    const [loading, setLoading] = useState(true);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        appointmentsToday: 0,
        appointmentsPending: 0,
        revenueMonth: 0,
        revenueToday: 0,
        weeklyData: [],
        recentAppointments: [],
        pageViews: 0,
        products: [],
        services: [],
        appointmentsMonthCount: 0,
        barbersStats: [],
        uniqueClientsMonth: 0,
        slug: ''
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
                const weekStart = startOfWeek(now, { weekStartsOn: 1 });
                const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

                const appointmentsRef = collection(db, 'appointments');

                // 1. Fetch Today's Appointments & Revenue
                const todayQuery = query(
                    appointmentsRef,
                    where('barbershopId', '==', user.uid),
                    where('date', '>=', Timestamp.fromDate(todayStart)),
                    where('date', '<=', Timestamp.fromDate(todayEnd))
                );
                const todaySnap = await getDocs(todayQuery);
                const appointmentsToday = todaySnap.size;
                const appointmentsPending = todaySnap.docs.filter(d => d.data().status === 'pending').length;
                const revenueToday = todaySnap.docs.reduce((acc, doc) => {
                    const data = doc.data();
                    return data.status !== 'cancelled' ? acc + (data.price || 0) : acc;
                }, 0);

                // 2. Fetch Month's Revenue & Count & Detailed Stats
                const monthQuery = query(
                    appointmentsRef,
                    where('barbershopId', '==', user.uid),
                    where('date', '>=', Timestamp.fromDate(monthStart)),
                    where('date', '<=', Timestamp.fromDate(monthEnd))
                );
                const monthSnap = await getDocs(monthQuery);
                const appointmentsMonthCount = monthSnap.size;
                const revenueMonth = monthSnap.docs.reduce((acc, doc) => {
                    const data = doc.data();
                    return data.status !== 'cancelled' ? acc + (data.price || 0) : acc;
                }, 0);

                // Unique Clients (based on phone number as proxy for unique ID)
                const uniqueClients = new Set(monthSnap.docs.map(d => d.data().phone));
                const uniqueClientsMonth = uniqueClients.size;

                // 3. Weekly Data
                const weekQuery = query(
                    appointmentsRef,
                    where('barbershopId', '==', user.uid),
                    where('date', '>=', Timestamp.fromDate(weekStart)),
                    where('date', '<=', Timestamp.fromDate(weekEnd))
                );
                const weekSnap = await getDocs(weekQuery);
                const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
                const weeklyData = daysOfWeek.map((day, index) => {
                    const currentDay = new Date(weekStart);
                    currentDay.setDate(weekStart.getDate() + index);
                    const count = weekSnap.docs.filter(doc => isSameDay(doc.data().date.toDate(), currentDay)).length;
                    return { name: day, appointments: count };
                });

                // 4. Recent Appointments
                const recentQuery = query(
                    appointmentsRef,
                    where('barbershopId', '==', user.uid),
                    where('date', '>=', Timestamp.fromDate(now)),
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
                        status: data.status === 'pending' ? 'Pendente' : 'Confirmado'
                    };
                });

                // 5. Page Views & Products & Services
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                const pageViews = userDocSnap.exists() ? (userDocSnap.data().pageViews || 0) : 0;

                const barbershopDocRef = doc(db, 'barbershops', user.uid);
                const barbershopSnap = await getDoc(barbershopDocRef);
                const products = barbershopSnap.exists() ? (barbershopSnap.data().products || []).slice(0, 3) : [];
                const services = barbershopSnap.exists() ? (barbershopSnap.data().services || []) : [];
                const slug = barbershopSnap.exists() ? barbershopSnap.data().slug : '';

                // 6. Fetch Barbers & Calculate Stats
                const barbersQuery = query(collection(db, 'barbershops', user.uid, 'professionals'), where('active', '==', true));
                const barbersSnap = await getDocs(barbersQuery);
                const barbers = barbersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Barber[];

                const barbersStats = barbers.map(barber => {
                    const barberAppointments = monthSnap.docs.filter(d => d.data().barberId === barber.id);
                    const barberRevenue = barberAppointments.reduce((acc, d) => {
                        const data = d.data();
                        return data.status !== 'cancelled' ? acc + (data.price || 0) : acc;
                    }, 0);
                    return {
                        id: barber.id,
                        name: barber.name,
                        photoUrl: barber.photoUrl,
                        appointments: barberAppointments.length,
                        revenue: barberRevenue
                    };
                });

                setMetrics({
                    appointmentsToday,
                    appointmentsPending,
                    revenueMonth,
                    revenueToday,
                    weeklyData,
                    recentAppointments,
                    pageViews,
                    products,
                    services,
                    appointmentsMonthCount,
                    barbersStats,
                    uniqueClientsMonth,
                    slug
                });

            } catch (error) {
                console.error("Error fetching dashboard metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [user]);

    const ticketMean = metrics.appointmentsMonthCount > 0
        ? metrics.revenueMonth / metrics.appointmentsMonthCount
        : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-8 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-white tracking-tight">Dashboard de Gestão</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors relative">
                        <Bell size={20} />
                        {metrics.appointmentsPending > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </button>
                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-yellow-600/20"
                    >
                        <Plus size={18} />
                        Novo Agendamento
                    </button>
                </div>
            </div>

            {/* Share Your Barbershop Card */}
            <ShareBarbershopCard slug={metrics.slug} />

            {/* KPI Cards */}
            <div id="tour-dashboard-stats" className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Revenue Today */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Receita Hoje</p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.revenueToday)}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            Diário
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-yellow-500">
                        <DollarSign size={24} />
                    </div>
                </div>

                {/* Appointments Today */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Agendamentos</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{metrics.appointmentsToday}</h3>
                        <p className="text-slate-500 text-xs mt-1">{metrics.appointmentsPending} pendentes</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-blue-500">
                        <Calendar size={24} />
                    </div>
                </div>

                {/* Ticket Mean */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Ticket Médio (Mês)</p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ticketMean)}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1 font-medium">
                            Base: {metrics.appointmentsMonthCount} agend.
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-purple-500">
                        <Receipt size={24} />
                    </div>
                </div>

                {/* Active Clients */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Clientes Ativos (Mês)</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{metrics.uniqueClientsMonth}</h3>
                        <p className="text-slate-500 text-xs mt-1 font-medium">
                            Únicos
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-green-500">
                        <UserPlus size={24} />
                    </div>
                </div>
            </div>

            {/* CHART SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Calendar className="text-blue-500" size={20} />
                            Volume de Agendamentos (Semanal)
                        </h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#1e293b' }}
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: '1px solid #334155',
                                        backgroundColor: '#0f172a',
                                        color: '#fff',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="appointments"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Team Performance - REAL DATA */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Users className="text-yellow-600" size={20} /> Desempenho da Equipe (Este Mês)
                </h3>
                {metrics.barbersStats.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {metrics.barbersStats.map((barber, i) => (
                            <div key={barber.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg relative overflow-hidden">
                                <div className={cn("absolute top-0 left-0 w-1 h-full", i % 2 === 0 ? "bg-green-500" : "bg-yellow-500")}></div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-xl bg-slate-600 flex items-center justify-center text-2xl overflow-hidden">
                                        {barber.photoUrl ? <img src={barber.photoUrl} alt={barber.name} className="w-full h-full object-cover" /> : <Users size={24} className="text-slate-400" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{barber.name}</h4>
                                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                            {/* Rating mocked as not in DB yet, or hide */}
                                            <span className="text-xs text-slate-500">Profissional</span>
                                        </div>
                                    </div>
                                    <div className="ml-auto flex flex-col items-end">
                                        <span className="text-lg font-bold text-white">
                                            {barber.revenue > 1000
                                                ? `${(barber.revenue / 1000).toFixed(1)}k`
                                                : barber.revenue}
                                        </span>
                                        <span className="text-xs text-slate-400">Receita</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t border-slate-700 pt-4">
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">Agendamentos</p>
                                        <p className="font-semibold text-white">{barber.appointments}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">Ticket Médio</p>
                                        <p className="font-semibold text-white">
                                            {barber.appointments > 0 ? (barber.revenue / barber.appointments).toFixed(0) : 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center text-slate-400">
                        Nenhum profissional com atividade este mês.
                    </div>
                )}
            </div>

            {/* Campaigns & Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Campaigns (Empty State for now as requested 'Real Data') */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Megaphone className="text-purple-500" size={20} /> Campanhas
                        </h3>
                    </div>
                    <div className="space-y-4 flex flex-col items-center justify-center min-h-[150px] text-center">
                        <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mb-2">
                            <Megaphone className="text-slate-500" size={24} />
                        </div>
                        <p className="text-slate-400 text-sm">Nenhuma campanha de marketing ativa no momento.</p>
                        <Link href="/dashboard/marketing" className="text-xs bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full hover:bg-purple-600/30 transition-colors">
                            Criar primeira campanha
                        </Link>
                    </div>
                </div>

                {/* Products */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Package className="text-orange-500" size={20} /> Vendas de Produtos
                        </h3>
                        <button className="text-xs text-orange-400 hover:text-orange-300">Gerenciar</button>
                    </div>
                    <div className="space-y-4">
                        {metrics.products.length > 0 ? metrics.products.map((product) => (
                            <div key={product.id} className="flex items-center gap-4 p-2 hover:bg-slate-700/30 rounded-lg transition-colors">
                                <div className="bg-slate-700 w-12 h-12 rounded flex items-center justify-center text-slate-400">
                                    <Package size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">{product.name}</p>
                                    <p className="text-xs text-slate-400">{product.active ? 'Disponível' : 'Indisponível'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-white">R$ {product.price.toFixed(2)}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-slate-500 py-4 text-sm flex flex-col items-center">
                                <Package className="mb-2 opacity-50" size={32} />
                                Nenhum produto cadastrado.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Traffic & Logs (Simplified/Emptied for Real Data consistency) */}
            <div className="grid grid-cols-1 gap-6 text-center">
                <div className="p-4 rounded-lg bg-slate-800/50 text-slate-500 text-xs">
                    Mais métricas de tráfego e logs estarão disponíveis em breve.
                </div>
            </div>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                barbershopId={user?.uid || ''}
                services={metrics.services}
                themeColor="#ca8a04"
            />
        </div>
    );
}
