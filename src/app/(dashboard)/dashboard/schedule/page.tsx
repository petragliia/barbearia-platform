'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import CalendarView from '@/features/calendar/components/CalendarView';
import { Appointment } from '@/types/appointment';
import { Loader2 } from 'lucide-react';

export default function SchedulePage() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'appointments'),
            where('barbershopId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Appointment[];

            setAppointments(data);
            setLoading(false);
        });

        return () => unsubscribe();
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
