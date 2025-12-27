import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NotificationSettings, NotificationSettingsSchema } from "../types";
import { z } from "zod";

const DEFAULT_SETTINGS: NotificationSettings = {
    channels: { whatsapp: true, email: true },
    triggers: {
        reminder24h: true,
        birthday: true,
        winBack: { enabled: true, daysInactive: 30 }
    }
};

export const useNotificationSettings = (barberId: string | undefined) => {
    const [settings, setSettings] = useState<NotificationSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!barberId) {
            setLoading(false);
            return;
        }

        const fetchSettings = async () => {
            try {
                setLoading(true);
                const docRef = doc(db, "barbershops", barberId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Extract only notification settings if nested, assuming root for now based on req
                    // Adjusting based on requirement "Interface NotificationSettings (dentro do documento do Barbeiro)"
                    // It's likely a field 'notificationSettings' inside the barber document or mixed fields.
                    // Let's assume it's stored in a field called 'notificationSettings' for cleaner separation,
                    // OR we can assume the barber document *implements* it.
                    // Given constraints, I'll look for a 'notificationSettings' field, or fallback to default.

                    const settingsData = data.notificationSettings || {};

                    // Validate and parse, falling back to defaults for missing fields
                    const result = NotificationSettingsSchema.safeParse({
                        ...DEFAULT_SETTINGS,
                        ...settingsData
                    });

                    if (result.success) {
                        setSettings(result.data);
                    } else {
                        console.error("Invalid notification settings:", result.error);
                        setSettings(DEFAULT_SETTINGS); // Fallback safe
                    }
                } else {
                    // Barber not found? Or just no settings yet.
                    setSettings(DEFAULT_SETTINGS);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load settings");
                setSettings(DEFAULT_SETTINGS);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [barberId]);

    const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
        if (!barberId || !settings) return;

        try {
            const mergedSettings = { ...settings, ...newSettings };
            const result = NotificationSettingsSchema.parse(mergedSettings); // Strict check before save

            const docRef = doc(db, "barbershops", barberId);
            await updateDoc(docRef, {
                notificationSettings: result
            });

            setSettings(result);
            return true;
        } catch (err: any) {
            console.error("Failed to update settings:", err);
            setError(err.message || "Failed to update settings");
            return false;
        }
    };

    return { settings, loading, error, updateSettings };
};
