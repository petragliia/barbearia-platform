import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, serverTimestamp } from 'firebase/firestore';
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

        // 1. Double-Booking Check
        const start = startOfDay(appointmentDate);
        const end = endOfDay(appointmentDate);

        const appointmentsRef = collection(db, 'appointments');
        const q = query(
            appointmentsRef,
            where('barbershopId', '==', barbershopId),
            where('date', '>=', Timestamp.fromDate(start)),
            where('date', '<=', Timestamp.fromDate(end))
        );

        const querySnapshot = await getDocs(q);
        const existingAppointments = querySnapshot.docs.map(doc => doc.data() as { time: string; service: { duration: string } });

        const serviceDuration = parseInt(service.duration.replace(/\D/g, '')) || 30;

        if (isOverlapping(time, serviceDuration, existingAppointments)) {
            return NextResponse.json({ error: 'Slot no longer available' }, { status: 409 });
        }

        // 2. Create Appointment
        const newAppointment = {
            customerName: name,
            customerPhone: phone,
            date: Timestamp.fromDate(appointmentDate),
            time,
            service,
            barbershopId,
            status: 'scheduled',
            createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'appointments'), newAppointment);

        // TODO: Trigger WhatsApp Message (Evolution API)

        return NextResponse.json({ id: docRef.id, message: 'Appointment created' }, { status: 201 });

    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
