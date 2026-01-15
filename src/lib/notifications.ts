// src/lib/notifications.ts

interface AppointmentNotificationProps {
    customerName: string;
    customerPhone: string;
    date: string; // ISO string
    time: string;
    serviceName: string;
    barbershopName?: string; // Optional, can be fetched or passed
}

export async function sendAppointmentNotification(data: AppointmentNotificationProps) {
    // Simulação de delay de rede
    // await new Promise(resolve => setTimeout(resolve, 100));



    // TODO: Integrar com Evolution API real
    /*
    import { sendWhatsAppMessage } from './evolution-api';
    
    const message = `Olá ${data.customerName}, seu agendamento de ${data.serviceName} para ${new Date(data.date).toLocaleDateString('pt-BR')} às ${data.time} foi confirmado!`;
    
    await sendWhatsAppMessage({
      phone: data.customerPhone,
      message: message
    });
    */
}

// Compatibility export for legacy code if needed
export const sendNotification = async (type: string, data: any) => {
    // Adapter to map old 'sendNotification' calls to new structure if feasible, 
    // or just console log to avoid runtime crash during transition

    if (type === 'confirmation') {
        // Best effort mapping
        await sendAppointmentNotification({
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            date: data.date.toISOString(),
            time: data.date.toLocaleTimeString(),
            serviceName: data.serviceName || 'Service'
        })
    }
}
