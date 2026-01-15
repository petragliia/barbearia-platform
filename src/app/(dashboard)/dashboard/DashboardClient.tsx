'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
    DollarSign, TrendingUp, User, Users, Scissors,
    ArrowUpRight, Clock, Globe, CheckCircle, AlertTriangle, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy chart components
const RevenueChart = dynamic(() => import('@/features/dashboard/components/RevenueChart'), {
    loading: () => <Skeleton className="h-[280px] w-full" />,
});

const ClientDistributionChart = dynamic(() => import('@/features/dashboard/components/ClientDistributionChart'), {
    loading: () => <Skeleton className="h-[200px] w-full" />,
});

export interface DashboardMetrics {
    revenueMonth: number;
    revenueGrowth: number;
    ticketMean: number;
    appointmentsTodayCount: number;
    newClients: number;
    returningClients: number;
}

export interface BarbershopInfo {
    slug: string;
    is_published: boolean;
}

interface DashboardClientProps {
    metrics: DashboardMetrics;
    chartData: any[];
    pieData: any[];
    barbershop: BarbershopInfo | null;
}

export default function DashboardClient({ metrics, chartData, pieData, barbershop }: DashboardClientProps) {
    const siteUrl = barbershop?.slug ? `${typeof window !== 'undefined' ? window.location.origin : ''}/site/${barbershop.slug}` : null;

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-8 space-y-8 font-sans animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-slate-400 mt-1">Visão geral e performance financeira.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2">
                        <Clock size={14} className="text-emerald-500" />
                        {format(new Date(), "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </span>
                </div>
            </div>

            {/* Empty State / Onboarding */}
            {metrics.revenueMonth === 0 && metrics.appointmentsTodayCount === 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="p-4 bg-blue-500/20 rounded-full">
                        <TrendingUp className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-white text-xl font-bold mb-2">Bem-vindo ao BarberSaaS! 🚀</h3>
                        <p className="text-slate-400 max-w-xl">
                            Você ainda não tem agendamentos registrados.
                            Comece divulgando seu link ou cadastre seu primeiro cliente manualmente para ver as estatísticas ganharem vida.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            className="bg-slate-800 text-white hover:bg-slate-700"
                            asChild
                        >
                            <Link href="/dashboard/site">Ver meu Site</Link>
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-500 text-white"
                            asChild
                        >
                            <Link href="/dashboard/schedule">Novo Agendamento</Link>
                        </Button>
                    </div>
                </div>
            )}

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* 1. Revenue Curve (Left Top - Span 8) */}
                <Card className="col-span-12 md:col-span-8 bg-slate-900 border-slate-800 shadow-xl overflow-hidden relative group">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-white text-lg font-medium">Curva de Faturamento</CardTitle>
                                <CardDescription className="text-slate-500">Últimos 7 dias</CardDescription>
                            </div>
                            <div className="bg-emerald-500/10 p-2 rounded-lg">
                                <TrendingUp className="text-emerald-500 h-5 w-5" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-0 pb-0">
                        <RevenueChart data={chartData} />
                    </CardContent>
                </Card>

                {/* 2. Right Column Stack (Span 4) */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-6">

                    {/* Total Earnings - Highlight Card */}
                    <Card className="bg-gradient-to-br from-emerald-600 to-emerald-900 border-none shadow-2xl relative overflow-hidden text-white flex-1 min-h-[160px]">
                        <div className="absolute top-0 right-0 p-3 opacity-20">
                            <DollarSign className="w-24 h-24" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-emerald-100 font-medium text-sm uppercase tracking-wider">Faturamento Mensal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold mt-2">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.revenueMonth)}
                            </div>
                            <div className="flex items-center gap-2 mt-4 text-emerald-100 text-sm bg-black/20 w-fit px-3 py-1 rounded-full">
                                <ArrowUpRight size={16} />
                                <span className="font-semibold">+{metrics.revenueGrowth}%</span> este mês
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ticket Mean & Cuts Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-slate-900 border-slate-800 shadow-md hover:border-slate-700 transition-colors">
                            <CardContent className="p-4 flex flex-col justify-between h-full">
                                <div className="p-2 bg-blue-500/10 w-fit rounded-lg mb-2">
                                    <Users className="text-blue-500 w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs font-medium">Ticket Médio</p>
                                    <p className="text-xl font-bold text-white mt-1">R$ {metrics.ticketMean.toFixed(0)}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-900 border-slate-800 shadow-md hover:border-slate-700 transition-colors">
                            <CardContent className="p-4 flex flex-col justify-between h-full">
                                <div className="p-2 bg-purple-500/10 w-fit rounded-lg mb-2">
                                    <Scissors className="text-purple-500 w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs font-medium">Cortes Hoje</p>
                                    <p className="text-xl font-bold text-white mt-1">{metrics.appointmentsTodayCount}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* 3. Client Analysis (Bottom Left - Span 8) */}
                <Card className="col-span-12 md:col-span-8 bg-slate-900 border-slate-800 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-white text-lg font-medium flex items-center gap-2">
                            <User className="text-indigo-400" size={20} /> Análise de Clientes
                        </CardTitle>
                        <CardDescription className="text-slate-500">Distribuição entre novos e recorrentes (Estimativa 30 dias)</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                        {/* Demographic Icons Visual */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                                {Array.from({ length: 20 }).map((_, i) => {
                                    // Visual calc
                                    const total = metrics.newClients + metrics.returningClients;
                                    const ratio = total > 0 ? metrics.returningClients / total : 0;
                                    const isRecurring = i < (ratio * 20);

                                    return (
                                        <User
                                            key={i}
                                            size={20}
                                            className={cn(
                                                "transition-all duration-500",
                                                isRecurring ? "text-emerald-500" : "text-blue-500 fill-blue-500/20"
                                            )}
                                        />
                                    );
                                })}
                            </div>
                            <div className="flex justify-between text-sm px-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                    <span className="text-slate-300">Recorrentes ({metrics.returningClients})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                    <span className="text-slate-300">Novos ({metrics.newClients})</span>
                                </div>
                            </div>
                        </div>

                        {/* Donut Chart */}
                        <ClientDistributionChart data={pieData} total={metrics.newClients + metrics.returningClients} />

                    </CardContent>
                </Card>

                {/* 4. Site Status & Hosting Link (Bottom Right - Span 4) */}
                <Card className="col-span-12 md:col-span-4 bg-slate-900 border-slate-800 shadow-xl overflow-hidden flex flex-col">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-white text-lg font-medium flex items-center gap-2">
                            <Globe className="text-cyan-400" size={20} /> Seu Site
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                        {/* Status Checker */}
                        <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                            <div className="flex items-center gap-3">
                                {barbershop?.is_published ? (
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <CheckCircle className="text-emerald-500 w-5 h-5" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                        <AlertTriangle className="text-yellow-500 w-5 h-5" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-white font-medium text-sm">Status</p>
                                    <p className={cn("text-xs font-semibold", barbershop?.is_published ? "text-emerald-400" : "text-yellow-400")}>
                                        {barbershop?.is_published ? "Publicado e Ativo" : "Não Publicado"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Link / URL */}
                        <div className="space-y-2">
                            <p className="text-slate-500 text-xs uppercase tracking-wide font-medium">Link de Acesso</p>
                            {barbershop?.slug ? (
                                <div className="flex items-center gap-2">
                                    <a
                                        href={siteUrl || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium truncate flex-1 hover:underline flex items-center gap-1"
                                    >
                                        {siteUrl}
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            ) : (
                                <p className="text-red-400 text-sm italic">Slug não configurado</p>
                            )}
                        </div>

                        {barbershop?.is_published ? (
                            <Button
                                variant="outline"
                                className="w-full border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white"
                                asChild
                            >
                                <a href={siteUrl || '#'} target="_blank" rel="noopener noreferrer">
                                    Acessar Site
                                </a>
                            </Button>
                        ) : (
                            <Button
                                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold"
                                asChild
                            >
                                <Link href="/dashboard/site">
                                    Publicar Agora
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
