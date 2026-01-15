import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isOverlapping } from '@/lib/date-utils';
import { startOfDay, endOfDay } from 'date-fns';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, date, time, service, barbershopId } = body;

        if (!name || !phone || !date || !time || !service || !barbershopId) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const appointmentDate = new Date(date);
        const supabase = await createClient();

        // 1. Double-Booking Check
        // Supabase query to check overlapping
        // We need to fetch existing appointments for that day
        const start = startOfDay(appointmentDate).toISOString();
        const end = endOfDay(appointmentDate).toISOString();

        const { data: existingAppointments, error: fetchError } = await supabase
            .from('appointments')
            .select('*')
            .eq('barbershop_id', barbershopId)
            // .gte('date', start) -> Assuming 'date' column stores timestamp or date string
            // .lte('date', end)
            // Note: If 'date' is just the date part, simpler. If 'date' is timestamp, range comparison needed.
            // Assuming 'date' in DB is actually the full timestamp of the appointment.
            // But here `date` from body is receiving likely an ISO string of the day.
            // In the previous code `date` field was used for the day.
            // Let's assume standard Supabase Timestamptz column for 'date'
            .gte('date', start)
            .lte('date', end);

        if (fetchError) throw fetchError;

        const mappedAppointments = (existingAppointments || []).map(app => ({
            time: app.time,
            service: { duration: app.duration || service.duration } // Need duration logic
        }));

        // Duration extraction fallback
        const serviceDuration = parseInt(service.duration.replace(/\D/g, '')) || 30;

        if (isOverlapping(time, serviceDuration, mappedAppointments)) {
            return NextResponse.json({ error: 'Slot no longer available' }, { status: 409 });
        }

        // 2. Create Appointment
        const newAppointment = {
            customer_name: name,
            customer_phone: phone,
            date: appointmentDate.toISOString(), // Standardizing to ISO string
            time,
            service_name: service.name,
            service_price: service.price,
            duration: service.duration, // Store duration string
            barbershop_id: barbershopId,
            status: 'scheduled',
            // createdAt will be handled by default value
        };

        const { data: inserted, error: insertError } = await supabase
            .from('appointments')
            .insert([newAppointment])
            .select()
            .single();

        if (insertError) throw insertError;

        // Send Notification (Mock -> Future Evolution API)
        try {
            const { sendAppointmentNotification } = await import('@/lib/notifications');
            await sendAppointmentNotification({
                customerName: name,
                customerPhone: phone,
                date: appointmentDate.toISOString(),
                time,
                serviceName: service.name,
                barbershopName: 'Barbearia' // Could fetch from DB if needed
            });
        } catch (notifError) {
            console.error('Failed to send notification (non-blocking):', notifError);
        }

        return NextResponse.json({ id: inserted.id, message: 'Appointment created' }, { status: 201 });

    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
