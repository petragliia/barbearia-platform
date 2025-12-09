import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
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
        // 1. Fetch Barbershop Settings
        const barbershopRef = collection(db, 'barbershops');
        // Since we store by ID (user.uid), we can try to get the doc directly if we knew the collection structure perfectly.
        // But the query above used 'barbershopId' field in appointments.
        // Let's assume the barbershopId param IS the document ID in 'barbershops' collection.

        // Fetch the barbershop document to get availability settings
        const { doc, getDoc } = await import('firebase/firestore');
        const barbershopDocRef = doc(db, 'barbershops', barbershopId);
        const barbershopSnap = await getDoc(barbershopDocRef);

        let openingHours = { start: '09:00', end: '18:00' };
        let workingDays = [1, 2, 3, 4, 5, 6]; // Default Mon-Sat

        if (barbershopSnap.exists()) {
            const data = barbershopSnap.data();
            if (data.content?.availability) {
                openingHours = data.content.availability.hours;
                workingDays = data.content.availability.days;
            }
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

        const start = startOfDay(selectedDate);
        const end = endOfDay(selectedDate);

        // 3. Fetch Existing Appointments
        const appointmentsRef = collection(db, 'appointments');
        const q = query(
            appointmentsRef,
            where('barbershopId', '==', barbershopId),
            where('date', '>=', Timestamp.fromDate(start)),
            where('date', '<=', Timestamp.fromDate(end))
        );

        const querySnapshot = await getDocs(q);
        const appointments = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Handle cancelled appointments - don't block slots
            if (data.status === 'cancelled') return null;

            return {
                time: format(data.date.toDate(), 'HH:mm'), // Extract time from Firestore Timestamp
                service: {
                    duration: '30 min' // Default or fetch if stored
                }
            };
        }).filter(Boolean) as { time: string; service: { duration: string } }[];

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
