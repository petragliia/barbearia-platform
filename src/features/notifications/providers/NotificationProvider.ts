import { NotificationChannel } from "../types";

export interface NotificationProvider {
    /**
     * Sends a message to a specific recipient.
     * @param to The recipient's identifier (phone number, email, etc.)
     * @param message The content of the message
     * @param channel The channel to use ('whatsapp', 'email', etc.)
     */
    send(to: string, message: string, channel: NotificationChannel): Promise<{ success: boolean; data?: any; error?: any }>;

    /**
     * Generates a message using AI based on the provided context.
     * @param context Contextual data for the AI to generate the message (e.g., customer name, service, date)
     */
    generateAiMessage?(context: any): Promise<string>;
}
