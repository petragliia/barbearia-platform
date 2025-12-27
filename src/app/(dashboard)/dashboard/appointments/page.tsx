'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Appointment } from '@/types/appointment';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, AlertCircle, LayoutList, Palette, Settings, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import CalendarView from '@/features/calendar/components/CalendarView';

export default function AppointmentsPage() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [showColorSettings, setShowColorSettings] = useState(false);

    // Custom Colors State (persisted in localStorage in a real app, just state here for MVP as requested "small system")
    const [colors, setColors] = useState({
        confirmed: '#22c55e', // green-500
        pending: '#eab308', // yellow-500
        cancelled: '#ef4444' // red-500
    });

    useEffect(() => {
        // Load from local storage if available
        const savedColors = localStorage.getItem('appointmentColors');
        if (savedColors) {
            setColors(JSON.parse(savedColors));
        }
    }, []);

    const saveColors = (newColors: typeof colors) => {
        setColors(newColors);
        localStorage.setItem('appointmentColors', JSON.stringify(newColors));
    };

    const fetchAppointments = async () => {
        if (!user) return;

        try {
            const q = query(
                collection(db, 'appointments'),
                where('barbershopId', '==', user.uid),
                orderBy('date', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Appointment[];

            setAppointments(data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [user]);

    const handleStatusUpdate = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
        try {
            const appointmentRef = doc(db, 'appointments', id);
            await updateDoc(appointmentRef, { status: newStatus });

            // Optimistic update
            setAppointments(prev => prev.map(app =>
                app.id === id ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Erro ao atualizar status.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-[calc(100dvh-100px)] flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Agendamentos</h1>
                    <p className="text-slate-400">Gerencie seus horários marcados.</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700 relative overflow-x-auto max-w-full">
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                            viewMode === 'list' ? "bg-slate-700 text-white shadow" : "text-slate-400 hover:text-white"
                        )}
                    >
                        <List size={16} />
                        Lista
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                            viewMode === 'calendar' ? "bg-slate-700 text-white shadow" : "text-slate-400 hover:text-white"
                        )}
                    >
                        <CalendarIcon size={16} />
                        Calendário
                    </button>

                    <div className="w-px h-6 bg-slate-700 mx-1" />

                    <button
                        onClick={() => setShowColorSettings(!showColorSettings)}
                        className={cn(
                            "p-1.5 rounded-md transition-all",
                            showColorSettings ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                        title="Personalizar Cores"
                    >
                        <Palette size={18} />
                    </button>

                    {/* Color Settings Dropdown */}
                    {showColorSettings && (
                        <div className="absolute top-12 right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-4 w-64 z-50 animate-in fade-in slide-in-from-top-2">
                            <h4 className="font-bold text-slate-100 mb-3 text-sm flex items-center gap-2">
                                <Palette size={14} /> Personalizar Cores
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Confirmado</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={colors.confirmed}
                                            onChange={(e) => saveColors({ ...colors, confirmed: e.target.value })}
                                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                        />
                                        <span className="text-xs font-mono text-slate-300">{colors.confirmed}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Pendente</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={colors.pending}
                                            onChange={(e) => saveColors({ ...colors, pending: e.target.value })}
                                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                        />
                                        <span className="text-xs font-mono text-slate-300">{colors.pending}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Cancelado</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={colors.cancelled}
                                            onChange={(e) => saveColors({ ...colors, cancelled: e.target.value })}
                                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                        />
                                        <span className="text-xs font-mono text-slate-300">{colors.cancelled}</span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full mt-3 text-xs text-slate-400 hover:text-white"
                                onClick={() => {
                                    setColors({ confirmed: '#22c55e', pending: '#eab308', cancelled: '#ef4444' });
                                    localStorage.removeItem('appointmentColors');
                                }}
                            >
                                Restaurar Padrão
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {viewMode === 'list' ? (
                appointments.length === 0 ? (
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CalendarIcon className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-100 mb-2">Nenhum agendamento</h3>
                        <p className="text-slate-400">
                            Quando seus clientes agendarem horários, eles aparecerão aqui.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 overflow-y-auto pb-4">
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-600 transition-colors shrink-0"
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                                        style={{
                                            backgroundColor: `${colors[appointment.status as keyof typeof colors]}20`,
                                            color: colors[appointment.status as keyof typeof colors]
                                        }}
                                    >
                                        {appointment.status === 'confirmed' ? <CheckCircle size={24} /> :
                                            appointment.status === 'cancelled' ? <XCircle size={24} /> :
                                                <Clock size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-100">{appointment.customerName}</h3>
                                        <p className="text-sm text-slate-400">{appointment.serviceName} • R$ {appointment.price.toFixed(2)}</p>
                                        <div className="flex items-center gap-2 mt-2 text-sm font-medium text-slate-300">
                                            <CalendarIcon size={14} className="text-slate-500" />
                                            {/* Handle Firestore Timestamp or Date string */}
                                            {new Date(appointment.date.seconds ? appointment.date.seconds * 1000 : appointment.date).toLocaleString('pt-BR')}
                                        </div>
                                    </div>
                                </div>

                                {appointment.status === 'pending' && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            className="text-red-400 hover:bg-red-900/20 hover:text-red-300 border-red-900/30 bg-transparent"
                                            onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            className="bg-green-600 hover:bg-green-500 text-white border-0"
                                            onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                                        >
                                            Confirmar
                                        </Button>
                                    </div>
                                )}

                                {appointment.status !== 'pending' && (
                                    <div
                                        className="px-4 py-2 rounded-full text-sm font-bold border"
                                        style={{
                                            backgroundColor: `${colors[appointment.status as keyof typeof colors]}10`,
                                            color: colors[appointment.status as keyof typeof colors],
                                            borderColor: `${colors[appointment.status as keyof typeof colors]}30`
                                        }}
                                    >
                                        {appointment.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="flex-1 min-h-0 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <CalendarView
                        appointments={appointments}
                        colors={colors}
                    />
                </div>
            )}
        </div>
    );
}
