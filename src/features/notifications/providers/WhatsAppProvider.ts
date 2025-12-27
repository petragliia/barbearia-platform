import { NotificationChannel } from "../types";
import { NotificationProvider } from "./NotificationProvider";

export class WhatsAppProvider implements NotificationProvider {
    private apiUrl: string;
    private apiKey: string;

    constructor() {
        // In a real scenario, these would come from environment variables or database config
        this.apiUrl = process.env.WHATSAPP_API_URL || "https://api.evolution-api.com/v1";
        this.apiKey = process.env.WHATSAPP_API_KEY || "mock-api-key";
    }

    async send(to: string, message: string, channel: NotificationChannel): Promise<{ success: boolean; data?: any; error?: any }> {
        if (channel !== 'whatsapp') {
            return { success: false, error: "WhatsAppProvider only supports 'whatsapp' channel" };
        }

        console.log(`[WhatsAppProvider] Preparing request to ${this.apiUrl}...`);

        // Mocking the external API call
        // In reality, this would be:
        // const response = await fetch(`${this.apiUrl}/message/sendText`, {
        //     method: 'POST',
        //     headers: { 'apikey': this.apiKey, 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ number: to, text: message })
        // });

        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[WhatsAppProvider] 🚀 Sent to ${to}: "${message}"`);
                resolve({ success: true, data: { status: "SENT", messageId: "mock-id-123" } });
            }, 500); // Simulate network delay
        });
    }

    async generateAiMessage(context: any): Promise<string> {
        // Could integrate with OpenAI here in the future
        return `Olá ${context.customerName}, aqui é da Barbearia! Seu horário de ${context.serviceName} está confirmado para ${context.date}.`;
    }
}
