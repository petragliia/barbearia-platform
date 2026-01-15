import { useState, useEffect } from "react";
import { getBarbershop, updateBarbershopByOwner } from "@/lib/services/barbershopService";
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
                // Assuming barberId is the Owner ID (User ID) as per service availability
                const data = await getBarbershop(barberId);

                if (data) {
                    // Extract settings from data.content (assuming structure)
                    // The previous Firebase code read `doc.data().notificationSettings`.
                    // In Supabase, we likely store it in `content` JSONB or a dedicated column?
                    // Let's assume `content.notificationSettings` to keep JSON structure usage consistent
                    // OR if migrated to a column, use that.
                    // Given Migration Plan, we put unstructured data in `content`.
                    const content: any = data.content || {};
                    const settingsData = content.notificationSettings || {};

                    // Validate and parse
                    const result = NotificationSettingsSchema.safeParse({
                        ...DEFAULT_SETTINGS,
                        ...settingsData
                    });

                    if (result.success) {
                        setSettings(result.data);
                    } else {
                        console.error("Invalid notification settings:", result.error);
                        setSettings(DEFAULT_SETTINGS);
                    }
                } else {
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
            const result = NotificationSettingsSchema.parse(mergedSettings);

            // Fetch current content first to merge? 
            // updateBarbershopByOwner in service might need explicit content merge if it doesn't do deep merge.
            // As seen in AvailabilityPage, strict merge is required.

            const currentData = await getBarbershop(barberId);
            const currentContent = currentData?.content || {};

            await updateBarbershopByOwner(barberId, {
                content: {
                    ...currentContent,
                    notificationSettings: result
                } as any
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
