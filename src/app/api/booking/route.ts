import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendNotification } from '@/lib/notifications';
import { addMinutes, startOfDay, endOfDay } from 'date-fns';
import { CreateAppointmentSchema } from '@/features/appointments/schemas/appointmentSchema';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Zod Validation
        const validationResult = CreateAppointmentSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { message: 'Dados inválidos', errors: validationResult.error.format() },
                { status: 400 }
            );
        }

        const data = validationResult.data;
        const { duration = 30 } = body; // Optional in schema, extract from body or default

        const supabase = await createClient();
        const appointmentStart = new Date(data.date);
        const appointmentEnd = addMinutes(appointmentStart, duration);

        // 2. Check for overlaps (Check-then-Act pattern)
        const dayStart = startOfDay(appointmentStart).toISOString();
        const dayEnd = endOfDay(appointmentStart).toISOString();

        const { data: existingAppointments, error: queryError } = await supabase
            .from('appointments')
            .select('*')
            .eq('barbershop_id', data.barbershopId)
            .gte('date', dayStart)
            .lte('date', dayEnd)
            .neq('status', 'cancelled');

        if (queryError) {
            throw new Error(`Database error: ${queryError.message}`);
        }

        // Logic to filter overlaps (generic, works for same-barber or shop-wide depending on requirements)
        // Here we should strictly check against the same BARBER (if assigned) or just the shop capacity?
        // Assuming strictly per barber if barberId exists, otherwise shop capacity (simplified here to global shop for now as before)
        // Wait, the original code checked simple overlap.
        // Let's refine: If barberId is present, we check conflicts for THAT barber.

        const isOverlapping = existingAppointments?.some(app => {
            // Filter by barber if applicable
            if (data.professionalId && app.barber_id && app.barber_id !== data.professionalId) {
                return false; // Different barber, no conflict
            }

            const existingStart = new Date(app.date);
            const existingDuration = app.duration || 30;
            const existingEnd = addMinutes(existingStart, existingDuration);

            return (appointmentStart < existingEnd && appointmentEnd > existingStart);
        });

        if (isOverlapping) {
            return NextResponse.json({ message: 'Horário indisponível. Por favor escolha outro.' }, { status: 409 });
        }

        // 3. Create Appointment
        const appointmentPayload = {
            barbershop_id: data.barbershopId,
            client_id: data.clientId || null, // Authenticated user ID or null
            // service_id? Originally serviceId was passed. Schema has serviceName.
            // Adjusting Payload to match Schema
            service_name: data.serviceName,
            price: data.price,
            date: appointmentStart.toISOString(),
            customer_name: data.clientName,
            customer_phone: data.clientPhone,
            status: 'pending',
            duration,
            barber_id: data.professionalId,
            // barber_name? Schema doesn't have it, but DB might want it.
            // body has it. Let's keep using body for non-validated extra fields if safe, or rely on what we have.
            // Better to rely on what Zod validated + defaults.
            // If barberName is needed for UI without join, we need it.
            // Let's assume frontend sends it and we trust it or fetch it.
            // For now, let's keep it from body but sanitize if needed.
            barber_name: body.barberName,
            products: body.products || []
        };

        const { data: newAppointment, error: insertError } = await supabase
            .from('appointments')
            .insert([appointmentPayload])
            .select()
            .single();

        if (insertError) {
            throw new Error(`Failed to create appointment: ${insertError.message}`);
        }

        // 4. Send Notification
        // Fire and forget
        sendNotification('confirmation', {
            serviceName: data.serviceName,
            date: appointmentStart,
            customerName: data.clientName,
            customerPhone: data.clientPhone,
        }).catch(err => console.error('Failed to send notification:', err));

        return NextResponse.json({ id: newAppointment.id, message: 'Agendamento realizado com sucesso!' }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating appointment:', error);
        return NextResponse.json({ message: 'Erro interno no servidor', error: error.message }, { status: 500 });
    }
}
