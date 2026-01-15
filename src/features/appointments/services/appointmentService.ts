import { createClient } from '@/lib/supabase/client';
import { Appointment } from '@/types/appointment';

export const AppointmentService = {
    async getAppointments(userId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('barbershop_id', userId)
            .order('date', { ascending: false });

        if (error) throw error;

        return data.map((item: any) => ({
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
        })) as Appointment[];
    },

    async updateStatus(id: string, status: 'confirmed' | 'cancelled') {
        const supabase = createClient();
        const { error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    }
};
