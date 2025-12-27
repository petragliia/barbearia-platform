import { z } from "zod";

// --- Enums & Basic Types ---

export const NotificationChannelSchema = z.enum(["whatsapp", "email"]);
export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;

export const NotificationTypeSchema = z.enum([
    "confirmation",
    "reminder_24h",
    "birthday",
    "win_back"
]);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const NotificationStatusSchema = z.enum(["sent", "failed", "pending"]);
export type NotificationStatus = z.infer<typeof NotificationStatusSchema>;

// --- Notification Settings ---

export const NotificationSettingsSchema = z.object({
    channels: z.object({
        whatsapp: z.boolean(),
        email: z.boolean(),
    }),
    triggers: z.object({
        reminder24h: z.boolean(),
        birthday: z.boolean(),
        winBack: z.object({
            enabled: z.boolean(),
            daysInactive: z.number().int().positive(),
        }),
    }),
});

export type NotificationSettings = z.infer<typeof NotificationSettingsSchema>;

// --- Notification Templates ---

export const NotificationTemplateSchema = z.object({
    id: z.string().optional(),
    barberId: z.string().nullable().optional(), // Null or undefined for global
    type: NotificationTypeSchema,
    content: z.string(), // E.g., "Olá {{customer_name}}, ..."
    isActive: z.boolean(),
});

export type NotificationTemplate = z.infer<typeof NotificationTemplateSchema>;

// --- Notification Logs ---

export const NotificationLogSchema = z.object({
    id: z.string().optional(),
    barberId: z.string(),
    customerId: z.string(),
    type: NotificationTypeSchema,
    channel: NotificationChannelSchema,
    sentAt: z.any(), // Firestore Timestamp
    status: NotificationStatusSchema,
    error: z.string().nullable().optional(),
    recipient: z.string().optional(),
    messageSnippet: z.string().optional(),
});

export type NotificationLog = z.infer<typeof NotificationLogSchema>;
