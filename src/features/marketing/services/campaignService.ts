
import { Client } from "@/features/crm/types";
import { CampaignFormValues } from "../schemas/campaignSchema";

// Use the inferred type from Zod schema directly for arguments
export type CampaignData = CampaignFormValues;

export interface TriggerResponse {
    success: boolean;
    message: string;
    id?: string;
}

export const triggerCampaign = async (
    campaign: CampaignData,
    recipients: Client[]
): Promise<TriggerResponse> => {
    // This URL would typically come from an environment variable
    // e.g. process.env.NEXT_PUBLIC_CAMPAIGN_WEBHOOK_URL
    const WEBHOOK_URL = process.env.NEXT_PUBLIC_CAMPAIGN_WEBHOOK_URL || "https://hook.n8n.cloud/webhook/test-campaign-trigger";

    const payload = {
        campaign: {
            ...campaign,
            triggeredAt: new Date().toISOString(),
            recipientCount: recipients.length
        },
        recipients: recipients.map(client => ({
            id: client.id,
            name: client.name,
            phone: client.phone,
            status: client.status,
            totalSpend: client.totalSpend,
            lastVisit: client.lastVisit ? client.lastVisit.toISOString() : null
        }))
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Even if the webhook fails (404 etc), we might want to handle it gracefully
            // or throw to show an error to the user.
            console.warn(`Webhook responded with status ${response.status}`);
            // For now, let's treat non-2xx as error
            throw new Error(`Falha ao disparar campanha: ${response.statusText}`);
        }

        const data = await response.json().catch(() => ({ success: true })); // Handle empty responses

        return {
            success: true,
            message: "Campanha disparada com sucesso!",
            id: data.id
        };

    } catch (error: any) {
        console.error("Error triggering campaign:", error);
        return {
            success: false,
            message: error.message || "Erro desconhecido ao conectar com o serviço de disparos."
        };
    }
};
