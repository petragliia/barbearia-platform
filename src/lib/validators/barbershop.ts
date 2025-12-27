import { z } from 'zod';

export const ServiceSchema = z.object({
    id: z.string().optional(), // Optional for new creations
    name: z.string().min(1, "Name is required"),
    price: z.number().min(0),
    duration: z.string().default("30 min"),
    description: z.string().optional()
});

export const BarbershopSchema = z.object({
    uid: z.string().min(1),
    name: z.string().min(1, "Barbershop name is required"),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    template_id: z.enum(['classic', 'modern', 'urban']).default('classic'),

    content: z.object({
        hero_image: z.string().url().or(z.literal('')),
        description: z.string().optional(),

        // Theme/Colors
        colors: z.object({
            primary: z.string().regex(/^#/, "Must be a hex code"),
            secondary: z.string().regex(/^#/, "Must be a hex code"),
            // Optional user overrides
            accent: z.string().optional(),
            background: z.string().optional(),
            text: z.string().optional()
        }),

        // Contact Info
        contact: z.object({
            phone: z.string().min(1, "Phone is required"),
            whatsapp: z.string().min(1, "WhatsApp is required"),
            address: z.string().min(1, "Address is required"),
            instagram: z.string().optional(),
            email: z.string().email().optional()
        }),

        // Text Overrides
        cta_text: z.string().optional(),
        services_title: z.string().optional(),
        services_subtitle: z.string().optional(),
        gallery_title: z.string().optional(),
        gallery_subtitle: z.string().optional(),
        about_title_top: z.string().optional(),
        about_title_middle: z.string().optional(),
        about_title_bottom: z.string().optional(),
        about_description: z.string().optional(),
        features: z.array(z.string()).optional()
    }).partial(), // Allow partial updates for content often? Better be strict on creation but loose on update.

    services: z.array(ServiceSchema).default([]),
    gallery: z.array(z.string()).default([]),

    // Settings
    isActive: z.boolean().default(true),
    createdAt: z.date().or(z.string()).optional(),
    updatedAt: z.date().or(z.string()).optional()
});

export type BarbershopInput = z.infer<typeof BarbershopSchema>;
export type ServiceInput = z.infer<typeof ServiceSchema>;
