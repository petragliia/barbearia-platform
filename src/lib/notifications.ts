import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CopywriterService } from '@/features/ai/services/CopywriterService';

interface NotificationData {
    barbershopName?: string;
    barbershopId?: string; // Added for context
    barberPlan?: string; // Added to check permissions
    barberStyle?: 'urban' | 'classic' | 'modern'; // Added for AI context
    serviceName?: string;
    date?: Date;
    customerName: string;
    customerPhone: string;
    lastService?: string; // For win-back
}

export async function sendNotification(type: 'confirmation' | 'win_back', data: NotificationData) {
    console.log(`[Notification Service] Processing ${type} for ${data.customerName}`);

    let message = '';

    if (type === 'confirmation' && data.serviceName && data.date) {
        message = `Olá ${data.customerName}, seu agendamento para ${data.serviceName} em ${data.date.toLocaleString('pt-BR')} foi confirmado!`;
    } else if (type === 'win_back') {
        // AI Integration
        if (data.barberPlan === 'BUSINESS') {
            console.log('[Notification Service] Using AI Copywriter for Business Plan...');
            message = await CopywriterService.generateMessage({
                type: 'win_back',
                customerName: data.customerName,
                barberStyle: data.barberStyle || 'modern',
                description: data.lastService ? `Último serviço: ${data.lastService}` : undefined
            });
        } else {
            // Static Fallback
            message = `Olá ${data.customerName}, saudade de você! Bora agendar um corte?`;
        }
    }

    // 1. Log to Console (Simulating external API call)
    console.log(`[WhatsApp Mock] Sending to ${data.customerPhone}: "${message}"`);

    // 2. Log to Firestore (Audit Trail)
    try {
        await addDoc(collection(db, 'notification_logs'), {
            type,
            ...data,
            message,
            status: 'sent',
            provider: 'mock',
            createdAt: serverTimestamp(),
            aiGenerated: data.barberPlan === 'BUSINESS' && type === 'win_back'
        });
    } catch (error) {
        console.error('[Notification Service] Failed to log notification:', error);
    }

    return { success: true, message };
}
