import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, Timestamp } from 'firebase/firestore';
import { sendNotification } from '@/lib/notifications';
import { addMinutes, startOfDay, endOfDay } from 'date-fns';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { barbershopId, serviceId, serviceName, price, date, duration = 30, customerName, customerPhone, barberId, barberName } = body;

        // Basic validation
        if (!barbershopId || !serviceId || !date || !customerName || !customerPhone || !barberId || !barberName) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const appointmentStart = new Date(date);
        const appointmentEnd = addMinutes(appointmentStart, duration);

        // Check for overlaps (Check-then-Act pattern)
        const appointmentsRef = collection(db, 'appointments');
        const q = query(
            appointmentsRef,
            where('barbershopId', '==', barbershopId),
            where('date', '>=', Timestamp.fromDate(startOfDay(appointmentStart))),
            where('date', '<=', Timestamp.fromDate(endOfDay(appointmentStart)))
        );

        const existingDocs = await import('firebase/firestore').then(mod => mod.getDocs(q));

        const isOverlapping = existingDocs.docs.some(doc => {
            const data = doc.data();
            if (data.status === 'cancelled') return false;

            const existingStart = data.date.toDate();
            // Fallback to 30 min if duration not stored
            const existingDuration = data.duration || 30;
            const existingEnd = addMinutes(existingStart, existingDuration);

            return (appointmentStart < existingEnd && appointmentEnd > existingStart);
        });

        if (isOverlapping) {
            return NextResponse.json({ message: 'Horário indisponível. Por favor escolha outro.' }, { status: 409 });
        }

        // Create
        const appointmentData = {
            barbershopId,
            serviceId,
            serviceName,
            price,
            date: Timestamp.fromDate(appointmentStart), // Ensure simplified Timestamp format
            customerName,
            customerPhone,
            status: 'pending',
            createdAt: serverTimestamp(),
            duration, // Store duration for future checks
            barberId,
            barberName,
            products: body.products || [] // Save products array
        };

        const docRef = await addDoc(collection(db, 'appointments'), appointmentData);

        // Send Notification
        sendNotification('confirmation', {
            serviceName,
            date: appointmentStart,
            customerName,
            customerPhone,
        }).catch(err => console.error('Failed to send notification:', err));

        return NextResponse.json({ id: docRef.id, message: 'Appointment created successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating appointment:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
