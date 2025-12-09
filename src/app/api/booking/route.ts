import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendNotification } from '@/lib/notifications';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { barbershopId, serviceId, serviceName, price, date, customerName, customerPhone } = body;

        // Basic validation
        if (!barbershopId || !serviceId || !date || !customerName || !customerPhone) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const appointmentDate = new Date(date);

        const appointmentData = {
            barbershopId,
            serviceId,
            serviceName,
            price,
            date: appointmentDate, // Convert ISO string to Date object
            customerName,
            customerPhone,
            status: 'pending',
            createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'appointments'), appointmentData);

        // Send Notification (Fire and forget, don't block response)
        sendNotification('confirmation', {
            serviceName,
            date: appointmentDate,
            customerName,
            customerPhone,
        }).catch(err => console.error('Failed to send notification:', err));

        return NextResponse.json({ id: docRef.id, message: 'Appointment created successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating appointment:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
