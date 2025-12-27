
import { z } from "zod";

export const campaignSchema = z.object({
    name: z.string().min(3, "Nome da campanha é obrigatório"),
    message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres"),
    targetAudience: z.enum(["all", "active", "inactive", "churned"]),
    scheduledDate: z.string().optional(), // ISO string date
});

export type CampaignFormValues = z.infer<typeof campaignSchema>;
