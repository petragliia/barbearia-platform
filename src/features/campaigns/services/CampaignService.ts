import { createClient } from '@/lib/supabase/client';
import { Campaign, CreateCampaignInput } from '@/features/campaigns/types';
import { canUser, PlanTier } from '@/config/plans';

export const campaignService = {
    async createCampaign(campaign: CreateCampaignInput) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('campaigns')
            .insert([campaign])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getCampaigns(barbershopId: string, plan: PlanTier = 'FREE') {
        // DRY Permission Check
        if (!canUser(plan, 'marketing')) {
            return { data: [], hasPermission: false };
        }

        const supabase = createClient();
        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .eq('barbershop_id', barbershopId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data: data as Campaign[], hasPermission: true };
    },

    async updateCampaignStatus(id: string, active: boolean) {
        const supabase = createClient();
        const { error } = await supabase
            .from('campaigns')
            .update({ active })
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    async deleteCampaign(id: string) {
        const supabase = createClient();
        const { error } = await supabase
            .from('campaigns')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
