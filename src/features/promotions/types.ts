import { z } from 'zod';

export interface Promotion {
    id: string;
    barbershop_id: string;
    title: string;
    trigger_service_ids: string[];
    offered_product_id: string;
    discounted_price: number;
    active: boolean;
    createdAt: string;
}

export const CreatePromotionSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    trigger_service_ids: z.array(z.string()).min(1, "Select at least one service"),
    offered_product_id: z.string().min(1, "Select a product to offer"),
    discounted_price: z.number().min(0, "Price must be positive"),
    active: z.boolean()
});

export type CreatePromotionInput = z.infer<typeof CreatePromotionSchema>;
