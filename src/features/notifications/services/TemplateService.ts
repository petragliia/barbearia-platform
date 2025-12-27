import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NotificationTemplate, NotificationTemplateSchema } from "../types";

export class TemplateService {
    /**
     * Fetches a template by type. Prioritizes barber-specific templates, falls back to global (null barberId).
     */
    static async getTemplate(type: string, barberId?: string): Promise<NotificationTemplate | null> {
        try {
            const templatesRef = collection(db, "notification_templates");

            // 1. Try to find a specific template for this barber
            if (barberId) {
                const q = query(
                    templatesRef,
                    where("type", "==", type),
                    where("barberId", "==", barberId),
                    where("isActive", "==", true)
                );
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const data = snapshot.docs[0].data();
                    return NotificationTemplateSchema.parse({ id: snapshot.docs[0].id, ...data });
                }
            }

            // 2. Fallback to global template
            const qGlobal = query(
                templatesRef,
                where("type", "==", type),
                where("barberId", "==", null), // or check for missing field if relying on that
                where("isActive", "==", true)
            );
            // Note: Firestore 'where field == null' works. 
            // Sometimes global templates might just omit the field. Let's assume explicit null or handled by omitted check logic if needed.
            // For now, explicit null check.

            const snapshotGlobal = await getDocs(qGlobal);
            if (!snapshotGlobal.empty) {
                const data = snapshotGlobal.docs[0].data();
                return NotificationTemplateSchema.parse({ id: snapshotGlobal.docs[0].id, ...data });
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
