import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    description: z.string().optional(),
    price: z.number().min(0, "Preço deve ser maior ou igual a 0"),
    stock: z.number().int().min(0, "Estoque deve ser maior ou igual a 0"),
    imageUrl: z.string().url("URL de imagem inválida").optional().or(z.literal("")),
    active: z.boolean().optional(),
    category: z.string(),
    barberId: z.string().optional(), // Admin might set this, or it's inferred from context
});

export type ProductFormValues = z.infer<typeof productSchema>;
