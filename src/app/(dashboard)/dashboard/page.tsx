import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
    startOfMonth, endOfMonth, subDays, isSameDay, parseISO, format
} from 'date-fns';
import DashboardClient, { DashboardMetrics, BarbershopInfo } from './DashboardClient';

interface DashboardAppointment {
    id: string;
    start_time: string;
    status: string;
    customer_name?: string;
    profiles?: {
        id: string;
        full_name: string;
        phone: string;
    } | null;
    services?: {
        name: string;
        price: number;
    } | null;
}

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const now = new Date();
    const queryStartDate = subDays(now, 30).toISOString();

    // Parallel Fetching for Performance
    const [appointmentsRes, barbershopRes] = await Promise.all([
        supabase
            .from('appointments')
            .select(`
                id, 
                start_time, 
                status, 
                customer_name, 
                services(name, price), 
                profiles(id, full_name, phone)
            `)
            .eq('barbershop_id', user.id)
            .gte('start_time', queryStartDate),
        supabase
            .from('barbershops')
            .select('slug, is_published')
            .eq('owner_id', user.id) // Assuming owner_id links to auth user
            .single()
    ]);

    const docs = (appointmentsRes.data || []) as unknown as DashboardAppointment[];
    const barbershop = barbershopRes.data as BarbershopInfo | null;

    // Logic processed on Server
    const validStatuses = ['completed', 'confirmed'];
    const monthDocs = docs.filter(app =>
        parseISO(app.start_time) >= startOfMonth(now) &&
        parseISO(app.start_time) <= endOfMonth(now)
    );

    const revenueMonth = monthDocs.reduce((acc, app) =>
        validStatuses.includes(app.status) ? acc + (app.services?.price || 0) : acc, 0
    );

    const monthCount = monthDocs.filter(a => validStatuses.includes(a.status)).length;
    const ticketMean = monthCount > 0 ? revenueMonth / monthCount : 0;

    const todayDocs = docs.filter(app => isSameDay(parseISO(app.start_time), now));
    const appointmentsTodayCount = todayDocs.length;

    const chartData = Array.from({ length: 7 }).map((_, i) => {
        const d = subDays(now, 6 - i);
        const dayDocs = docs.filter(app => isSameDay(parseISO(app.start_time), d));
        const dayRev = dayDocs.reduce((acc, app) =>
            validStatuses.includes(app.status) ? acc + (app.services?.price || 0) : acc, 0
        );
        return {
            name: format(d, 'dd/MM'),
            value: dayRev
        };
    });

    const clientCounts = new Map<string, number>();
    docs.forEach(d => {
        const key = d.profiles?.phone || d.customer_name || 'unknown';
        clientCounts.set(key, (clientCounts.get(key) || 0) + 1);
    });

    let returning = 0;
    let newC = 0;
    monthDocs.forEach(d => {
        const key = d.profiles?.phone || d.customer_name || 'unknown';
        if ((clientCounts.get(key) || 0) > 1) returning++;
        else newC++;
    });

    if (returning === 0 && newC === 0) newC = 1;

    const pieData = [
        { name: 'Recorrentes', value: returning, color: '#10b981' },
        { name: 'Novos', value: newC, color: '#3b82f6' },
    ];

    const metrics: DashboardMetrics = {
        revenueMonth,
        revenueGrowth: 12.5,
        ticketMean,
        appointmentsTodayCount,
        newClients: newC,
        returningClients: returning
    };

    return (
        <DashboardClient
            metrics={metrics}
            chartData={chartData}
            pieData={pieData}
            barbershop={barbershop}
        />
    );
}
