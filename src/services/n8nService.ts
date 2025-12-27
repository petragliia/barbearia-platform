export interface WhatsAppAppointmentData {
    barberName: string;
    clientName: string;
    clientPhone: string;
    serviceName: string;
    date: string;
    time: string;
}

/**
 * Formats phone number to 55DD9XXXXXXXX standard
 * Removes all non-numeric characters
 * Ensures 55 prefix if missing
 */
export const formatPhoneForAPI = (phone: string): string => {
    // Remove all non-numeric chars
    let cleanPhone = phone.replace(/\D/g, '');

    // If starts with 0, remove it (e.g. 011...)
    if (cleanPhone.startsWith('0')) {
        cleanPhone = cleanPhone.substring(1);
    }

    // Check if it has country code (assuming Brazil 55)
    // Basic validation: Mobile numbers in BR are usually 11 digits (DDD + 9 + 8 digits)
    // If length is 10 or 11, it probably lacks 55.
    if (cleanPhone.length === 10 || cleanPhone.length === 11) {
        cleanPhone = `55${cleanPhone}`;
    }

    return cleanPhone;
};

export const n8nService = {
    sendAppointmentToWhatsapp: async (data: WhatsAppAppointmentData) => {
        const webhookUrl = process.env.NEXT_PUBLIC_N8N_WHATSAPP_WEBHOOK;

        if (!webhookUrl) {
            console.warn('N8N Webhook URL not configured (NEXT_PUBLIC_N8N_WHATSAPP_WEBHOOK)');
            return;
        }

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Failed to send to n8n: ${response.statusText}`);
            }

            return true;
        } catch (error) {
            console.error('Error sending appointment to n8n:', error);
            // We don't throw here to avoid blocking the user flow in frontend if notification fails
            return false;
        }
    },

    /**
     * Triggers a generic n8n workflow
     * @param workflow The workflow identifier or slug
     * @param data The payload to send
     */
    triggerWorkflow: async (workflow: string, data: any) => {
        // Try to find a specific webhook for the workflow or fall back to a general one
        // For now, we assume a general webhook env var or reuse the whatsapp one if appropriate, 
        // but ideally this should be distinct. 
        // We will look for NEXT_PUBLIC_N8N_WEBHOOK
        const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK;

        if (!webhookUrl) {
            console.warn('Generic N8N Webhook URL not configured (NEXT_PUBLIC_N8N_WEBHOOK)');
            return false;
        }

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workflow,
                    ...data
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to trigger workflow ${workflow}: ${response.statusText}`);
            }

            return true;
        } catch (error) {
            console.error(`Error triggering workflow ${workflow}:`, error);
            return false;
        }
    }
};
