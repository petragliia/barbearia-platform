import { NotificationChannel } from "../types";
import { NotificationProvider } from "./NotificationProvider";

export class ConsoleProvider implements NotificationProvider {
    async send(to: string, message: string, channel: NotificationChannel): Promise<{ success: boolean; data?: any; error?: any }> {
        console.log(`[ConsoleProvider] [${channel.toUpperCase()}] To: ${to} | Message: "${message}"`);
        return { success: true };
    }

    async generateAiMessage(context: any): Promise<string> {
        console.log(`[ConsoleProvider] Generating AI message with context:`, context);
        return `[AI Generated] Hello ${context.customerName || 'Customer'}, this is a generated message.`;
    }
}
