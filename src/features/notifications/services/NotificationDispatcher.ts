import { createClient } from "@/lib/supabase/client";
import { NotificationChannel, NotificationType } from "../types";
import { NotificationProvider } from "../providers/NotificationProvider";
import { ConsoleProvider } from "../providers/ConsoleProvider";
import { WhatsAppProvider } from "../providers/WhatsAppProvider";

export class NotificationDispatcher {
    private providers: Record<NotificationChannel, NotificationProvider>;
    private supabase = createClient();

    constructor() {
        // Initialize providers
        // In the future, this could be dynamic based on feature flags or environment
        this.providers = {
            whatsapp: new WhatsAppProvider(),
            email: new ConsoleProvider(), // Using Console for email for now as it wasn't requested in detail yet
        };

        // Allow overriding with ConsoleProvider for dev/testing if needed
        if (process.env.NEXT_PUBLIC_USE_MOCK_NOTIFICATIONS === 'true') {
            const consoleProvider = new ConsoleProvider();
            this.providers.whatsapp = consoleProvider;
            this.providers.email = consoleProvider;
        }
    }

    /**
     * Dispatches a notification to the specified channel and logs the result.
     */
    async dispatch(
        params: {
            barberId: string;
            customerId: string;
            to: string;
            message: string;
            channel: NotificationChannel;
            type: NotificationType;
        }
    ): Promise<{ success: boolean; logId?: string; error?: string }> {
        const { barberId, customerId, to, message, channel, type } = params;
        const provider = this.providers[channel];

        if (!provider) {
            console.error(`[NotificationDispatcher] No provider found for channel: ${channel}`);
            return { success: false, error: `No provider for channel ${channel}` };
        }

        let status: 'sent' | 'failed' = 'sent';
        let errorMsg: string | undefined = undefined;

        try {
            // 1. Send via Provider
            const result = await provider.send(to, message, channel);

            if (!result.success) {
                status = 'failed';
                errorMsg = result.error;
            }

        } catch (err: any) {
            console.error(`[NotificationDispatcher] Error sending notification:`, err);
            status = 'failed';
            errorMsg = err.message || 'Unknown error';
        }

        // 2. Log to Supabase
        let logId: string | undefined;
        try {
            const { data, error } = await this.supabase
                .from("notification_logs")
                .insert([{
                    barber_id: barberId,
                    customer_id: customerId,
                    type,
                    channel,
                    sent_at: new Date().toISOString(),
                    status,
                    error: errorMsg || null,
                    recipient: to,
                    message_snippet: message.slice(0, 50) + (message.length > 50 ? '...' : '')
                }])
                .select()
                .single();

            if (data) logId = data.id;
            if (error) throw error;
            console.log(`[NotificationDispatcher] Logged notification ${logId} with status ${status}`);

        } catch (logErr) {
            console.error(`[NotificationDispatcher] CRITICAL: Failed to log notification to Supabase`, logErr);
            // We don't fail the whole operation just because logging failed, but this is critical for the requirement
        }

        return { success: status === 'sent', logId, error: errorMsg };
    }
}

// Export a singleton instance for easier usage
export const notificationDispatcher = new NotificationDispatcher();
