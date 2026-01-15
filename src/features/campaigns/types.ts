export type CampaignType = 'marketing' | 'reminder' | 'winback';
export type CampaignChannel = 'whatsapp' | 'email' | 'sms';
export type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft';

export interface Campaign {
    id: string;
    barbershop_id: string;
    title: string;
    description?: string;
    type: CampaignType;
    channel: CampaignChannel;
    status: CampaignStatus;
    active: boolean; // Simplified toggle
    config: any; // Flexible JSON for specific channel config
    metrics?: {
        sent: number;
        opened: number;
        clicked: number;
        converted: number;
    };
    created_at: string;
    updated_at: string;
}

export interface CreateCampaignInput {
    barbershop_id: string;
    title: string;
    type: CampaignType;
    channel: CampaignChannel;
    config: any;
    active?: boolean;
}
