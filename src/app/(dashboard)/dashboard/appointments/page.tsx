'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Calendar, Clock, User, Phone, Loader2, List, Palette, CheckCircle, XCircle } from 'lucide-react';
import NewAppointmentModal from '@/features/appointments/components/NewAppointmentModal';
import { getBarbershop } from '@/lib/services/barbershopService';
import { Service } from '@/types/barbershop';
import { cn } from '@/lib/utils';
import CalendarView from '@/features/calendar/components/CalendarView';
import { useAppointments } from '@/features/appointments/hooks/useAppointments';
import AppointmentsList from '@/features/appointments/components/AppointmentsList';
import { createClient } from '@/lib/supabase/client';
import { Barber } from '@/features/team/types';

export default function AppointmentsPage() {
    const { user } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

    // Custom Hooks
    const { appointments, loading: appointmentsLoading, fetchAppointments, updateStatus } = useAppointments(user?.id);
    const supabase = createClient();

    // Fetch Services & Barbers (Auxiliary Data) -> ideally should be hooks too
    const fetchAuxData = async () => {
        if (!user) return;
        try {
            const userId = (user as any).uid || user.id;

            // Fetch Services
            const shopData = await getBarbershop(userId);
            if (shopData?.services) {
                setServices(shopData.services);
            }

            // Fetch Barbers
            const { data: barbersData } = await supabase
                .from('professionals')
                .select('*')
                .eq('barbershop_id', userId)
                .eq('active', true);

            if (barbersData) {
                setBarbers(barbersData.map((b: any) => ({
                    id: b.id,
                    ...b,
                    photoUrl: b.photo_url
                })) as Barber[]);
            }
        } catch (err) {
            console.error("Error loading aux data:", err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAppointments();
            fetchAuxData();
        }
    }, [user, fetchAppointments]);

    const handleStatusUpdate = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
        try {
            await updateStatus(id, newStatus);
        } catch (error) {
            alert("Erro ao atualizar status.");
        }
    };

    const handleSuccess = () => {
        fetchAppointments();
    };

    return (
        <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-white font-sans selection:bg-cyan-500/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter text-white uppercase italic">
                        Gestão de <span className="text-cyan-400">Agendamentos</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Controle sua agenda em tempo real.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn("p-2 rounded md:px-4 md:py-2 text-sm font-bold uppercase transition-all", viewMode === 'list' ? "bg-cyan-600/20 text-cyan-400" : "text-slate-500 hover:text-white")}
                        >
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={cn("p-2 rounded md:px-4 md:py-2 text-sm font-bold uppercase transition-all", viewMode === 'calendar' ? "bg-cyan-600/20 text-cyan-400" : "text-slate-500 hover:text-white")}
                        >
                            <Calendar size={20} />
                        </button>
                    </div>

                    <NewAppointmentModal
                        services={services}
                        barbers={barbers}
                        onSuccess={handleSuccess}
                    />
                </div>
            </div>

            {appointmentsLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="animate-spin text-cyan-400 mb-4" size={40} />
                    <p className="text-slate-400 animate-pulse text-sm uppercase tracking-widest">Sincronizando...</p>
                </div>
            ) : viewMode === 'list' ? (
                <AppointmentsList
                    appointments={appointments}
                    onStatusUpdate={handleStatusUpdate}
                />
            ) : (
                <div className="flex-1 min-h-0 bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                    <CalendarView
                        appointments={appointments}
                        colors={{ confirmed: '#22c55e', pending: '#eab308', cancelled: '#ef4444' }}
                    />
                </div>
            )}
        </div>
    );
}
