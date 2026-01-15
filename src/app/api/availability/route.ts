import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSlots, isOverlapping } from '@/lib/date-utils';
import { startOfDay, endOfDay, parseISO, format } from 'date-fns';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const barbershopId = searchParams.get('barbershopId');
    const serviceDurationParam = searchParams.get('serviceDuration');

    if (!dateParam || !barbershopId || !serviceDurationParam) {
        return NextResponse.json({ error: 'Missing required parameters: date, barbershopId, serviceDuration' }, { status: 400 });
    }

    try {
        const supabase = await createClient();

        // 1. Fetch Barbershop Settings
        // Using 'id' from barbershops table.
        const { data: barbershopData, error: bsError } = await supabase
            .from('barbershops')
            .select('content')
            .eq('id', barbershopId)
            .single();

        let openingHours = { start: '09:00', end: '18:00' };
        let workingDays = [1, 2, 3, 4, 5, 6]; // Default Mon-Sat

        if (barbershopData?.content?.availability) {
            openingHours = barbershopData.content.availability.hours;
            workingDays = barbershopData.content.availability.days;
        }

        // 2. Parse Date and Define Range
        const selectedDate = parseISO(dateParam);
        const dayOfWeek = selectedDate.getDay(); // 0=Sun, 1=Mon...

        // Check if open on this day
        if (!workingDays.includes(dayOfWeek)) {
            return NextResponse.json({
                slots: [],
                meta: {
                    date: dateParam,
                    totalSlots: 0,
                    available: 0,
                    message: "Closed on this day"
                }
            });
        }

        const start = startOfDay(selectedDate).toISOString();
        const end = endOfDay(selectedDate).toISOString();

        // 3. Fetch Existing Appointments
        const { data: appointmentsData, error: appError } = await supabase
            .from('appointments')
            .select('date, duration, status')
            .eq('barbershop_id', barbershopId)
            .gte('date', start)
            .lte('date', end)
            .neq('status', 'cancelled');

        const appointments = (appointmentsData || []).map(app => ({
            time: format(new Date(app.date), 'HH:mm'), // ISO String to Date to Format
            service: {
                duration: app.duration ? `${app.duration} min` : '30 min'
            }
        }));

        // 4. Generate All Possible Slots based on dynamic hours
        const allSlots = getSlots(openingHours.start, openingHours.end, 30);

        // 5. Filter for Availability
        const requestedDuration = parseInt(serviceDurationParam) || 30;

        const availableSlots = allSlots.filter(slot =>
            !isOverlapping(slot, requestedDuration, appointments)
        );

        return NextResponse.json({
            slots: availableSlots,
            meta: {
                date: dateParam,
                totalSlots: allSlots.length,
                available: availableSlots.length
            }
        });

    } catch (error) {
        console.error('[API] Error calculating availability:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
