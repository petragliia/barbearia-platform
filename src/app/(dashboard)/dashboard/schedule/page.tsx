'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import CalendarView from '@/features/calendar/components/CalendarView';
import { Appointment } from '@/types/appointment';
import { Loader2 } from 'lucide-react';

export default function SchedulePage() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (!user) return;
        const userId = (user as any).uid || user.id;

        const fetchAppointments = async () => {
            const { data } = await supabase
                .from('appointments')
                .select('*')
                .eq('barbershop_id', userId);

            if (data) {
                const mappedData: Appointment[] = data.map((item: any) => ({
                    id: item.id,
                    customerName: item.customer_name,
                    customerPhone: item.customer_phone,
                    date: item.date,
                    time: item.time,
                    serviceName: item.service_name,
                    price: item.service_price,
                    status: item.status,
                    barbershopId: item.barbershop_id,
                    createdAt: item.created_at,
                    barberId: item.barber_id || '',
                    barberName: item.barber_name || ''
                }));
                setAppointments(mappedData);
            }
            setLoading(false);
        };

        fetchAppointments();
        // Optional: Set up real-time subscription here if needed
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">Agenda</h1>
                <p className="text-slate-400">Gerencie todos os seus agendamentos.</p>
            </div>

            <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
                <CalendarView
                    appointments={appointments}
                    onDateSelect={(date) => console.log(date)}
                />
            </div>
        </div>
    );
}
