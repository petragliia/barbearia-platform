import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getNotificationSettingsRef } from "@/lib/firebase/collections";
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
            const docRef = doc(getNotificationSettingsRef(), barberId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Parse and validate with Zod to ensure type safety
                const data = docSnap.data();
                const result = NotificationSettingsSchema.safeParse(data);

                if (result.success) {
                    return result.data;
                } else {
                    console.warn(`[SettingsService] Invalid settings schema for ${barberId}, returning default.`, result.error);
                    return DEFAULT_SETTINGS;
                }
            } else {
                return DEFAULT_SETTINGS;
            }
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
            // Validate the partial structure if possible, but Zod parse handles full objects well.
            // For partial updates, we might need a partial schema or just trust the merge.
            // A better approach for "update" is often to get current, merge, validate, then save.

            // However, Firestore setDoc with merge: true handles deep merges.
            // Let's validate the specific fields being sent if they are complete sub-objects, 
            // but for partial deep updates it's tricky. 
            // Simpler approach: We assume 'settings' passed here matches the Partial<NotificationSettings>
            // and we rely on the implementation to be correct.

            // To ensure we don't save garbage, let's try to validate loosely or just save.

            const docRef = doc(getNotificationSettingsRef(), barberId);
            await setDoc(docRef, settings, { merge: true });

        } catch (error) {
            console.error(`[SettingsService] Error updating settings for ${barberId}:`, error);
            throw error;
        }
    }
}
