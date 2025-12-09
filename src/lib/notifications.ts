import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface NotificationData {
    barbershopName?: string;
    serviceName: string;
    date: Date;
    customerName: string;
    customerPhone: string;
}

export async function sendNotification(type: 'confirmation', data: NotificationData) {
    console.log(`[Notification Service] Sending ${type} to ${data.customerName} (${data.customerPhone})`);

    const message = `Olá ${data.customerName}, seu agendamento para ${data.serviceName} em ${data.date.toLocaleString('pt-BR')} foi confirmado!`;

    // 1. Log to Console (Simulating external API call)
    console.log(`[WhatsApp Mock] Sending to ${data.customerPhone}: "${message}"`);
    console.log(`[Email Mock] Sending to ${data.customerName}: "${message}"`);

    // 2. Log to Firestore (Audit Trail)
    try {
        await addDoc(collection(db, 'notification_logs'), {
            type,
            ...data,
            message,
            status: 'sent', // Mocking success
            provider: 'mock',
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('[Notification Service] Failed to log notification:', error);
    }

    return { success: true };
}
