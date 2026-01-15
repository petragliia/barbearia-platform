import { createClient } from '@/lib/supabase/client';
import { NotificationSettings, NotificationSettingsSchema } from "../types";

export const DEFAULT_SETTINGS: NotificationSettings = {
    channels: {
        whatsapp: false,
        email: false,
    },
    triggers: {
        reminder24h: false,
        birthday: false,
        winBack: {
            enabled: false,
            daysInactive: 30,
        },
    },
};

export class SettingsService {
    /**
     * Fetches notification settings for a specific barber.
     * Returns default conservative settings if not found.
     */
    static async getSettings(barberId: string): Promise<NotificationSettings> {
        try {
            const supabase = createClient();
            // Assuming we have a 'notification_settings' table or stored in 'barbershops' JSONB.
            // Let's assume a dedicated table linked by 'barbershop_id' because settings can grow.
            const { data, error } = await supabase
                .from('notification_settings')
                .select('*')
                .eq('barbershop_id', barberId)
                .single();

            if (data) {
                // If stored as JSONB 'settings' column:
                if (data.settings) {
                    const result = NotificationSettingsSchema.safeParse(data.settings);
                    if (result.success) return result.data;
                }
            }

            return DEFAULT_SETTINGS;
        } catch (error) {
            console.error(`[SettingsService] Error fetching settings for ${barberId}:`, error);
            // Fail safe
            return DEFAULT_SETTINGS;
        }
    }

    /**
     * Updates notification settings for a specific barber.
     * Merges with existing data.
     */
    static async updateSettings(barberId: string, settings: Partial<NotificationSettings>): Promise<void> {
        try {
            const supabase = createClient();

            // Simpler: Fetch, Merge, Save.

            const current = await this.getSettings(barberId);
            const merged = { ...current, ...settings };
            const { error } = await supabase
                .from('notification_settings')
                .upsert({
                    barbershop_id: barberId,
                    settings: merged,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'barbershop_id' }); // Assuming unique constraint on barbershop_id

            if (error) throw error;

        } catch (error) {
            console.error(`[SettingsService] Error updating settings for ${barberId}:`, error);
            throw error;
        }
    }
}
