import { createClient } from "@/lib/supabase/client";
import { NotificationTemplate, NotificationTemplateSchema } from "../types";

export class TemplateService {
    /**
     * Fetches a template by type. Prioritizes barber-specific templates, falls back to global (null barberId).
     */
    static async getTemplate(type: string, barberId?: string): Promise<NotificationTemplate | null> {
        const supabase = createClient();
        try {
            // 1. Try to find a specific template for this barber
            if (barberId) {
                const { data, error } = await supabase
                    .from("notification_templates")
                    .select("*")
                    .eq("type", type)
                    .eq("barber_id", barberId)
                    .eq("is_active", true)
                    .single(); // Assuming only one active template per type per barber

                if (data) {
                    return NotificationTemplateSchema.parse({
                        id: data.id,
                        type: data.type,
                        content: data.content,
                        barberId: data.barber_id,
                        isActive: data.is_active
                    });
                }
            }

            // 2. Fallback to global template
            const { data: globalData } = await supabase
                .from("notification_templates")
                .select("*")
                .eq("type", type)
                .is("barber_id", null)
                .eq("is_active", true)
                .single();

            if (globalData) {
                return NotificationTemplateSchema.parse({
                    id: globalData.id,
                    type: globalData.type,
                    content: globalData.content,
                    barberId: null, // explicit null
                    isActive: globalData.is_active
                });
            }

            return null;
        } catch (error) {
            console.error("Error fetching template:", error);
            return null;
        }
    }

    /**
     * Replaces variables in the template content.
     * Supported format: {variableName}
     */
    static parse(content: string, variables: Record<string, string>): string {
        if (!content) return "";

        return content.replace(/{(\w+)}/g, (match, key) => {
            return variables[key] || match; // Keep original if variable not found
        });
    }
}
