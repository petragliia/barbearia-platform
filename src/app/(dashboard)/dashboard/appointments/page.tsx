'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Appointment } from '@/types/appointment';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AppointmentsPage() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Agendamentos</h1>
                <p className="text-slate-500">Gerencie seus horários marcados.</p>
            </div>

            {appointments.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhum agendamento</h3>
                    <p className="text-slate-500">
                        Quando seus clientes agendarem horários, eles aparecerão aqui.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {appointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                                    appointment.status === 'confirmed' ? "bg-green-100 text-green-600" :
                                        appointment.status === 'cancelled' ? "bg-red-100 text-red-600" :
                                            "bg-yellow-100 text-yellow-600"
                                )}>
                                    {appointment.status === 'confirmed' ? <CheckCircle size={24} /> :
                                        appointment.status === 'cancelled' ? <XCircle size={24} /> :
                                            <Clock size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{appointment.customerName}</h3>
                                    <p className="text-sm text-slate-500">{appointment.serviceName} • R$ {appointment.price.toFixed(2)}</p>
                                    <div className="flex items-center gap-2 mt-2 text-sm font-medium text-slate-700">
                                        <Calendar size={14} />
                                        {/* Handle Firestore Timestamp or Date string */}
                                        {new Date(appointment.date.seconds ? appointment.date.seconds * 1000 : appointment.date).toLocaleString('pt-BR')}
                                    </div>
                                </div>
                            </div>

                            {appointment.status === 'pending' && (
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                                        onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                                    >
                                        Confirmar
                                    </Button>
                                </div>
                            )}

                            {appointment.status !== 'pending' && (
                                <div className={cn(
                                    "px-4 py-2 rounded-full text-sm font-bold",
                                    appointment.status === 'confirmed' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                )}>
                                    {appointment.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
