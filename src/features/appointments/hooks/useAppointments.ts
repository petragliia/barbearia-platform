import { useState, useCallback } from 'react';
import { Appointment } from '@/types/appointment';
import { AppointmentService } from '../services/appointmentService';

export function useAppointments(userId: string | undefined) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const data = await AppointmentService.getAppointments(userId);
            setAppointments(data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const updateStatus = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
        try {
            await AppointmentService.updateStatus(id, newStatus);
            setAppointments(prev => prev.map(app =>
                app.id === id ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error("Error updating status:", error);
            throw error;
        }
    };

    return {
        appointments,
        loading,
        fetchAppointments,
        updateStatus,
        setAppointments // Helper if needed
    };
}
