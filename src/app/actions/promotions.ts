'use server';

import { createClient } from '@/lib/supabase/server';
import { Promotion, CreatePromotionSchema, CreatePromotionInput } from '@/features/promotions/types';
import { getBarbershopByOwner } from '@/app/actions/barbershop';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

const PROMOTIONS_TABLE = 'promotions';

// Helper to get current user ID securely on server
async function getCurrentUserUid() {
    // With Supabase server client, checking auth is implicit/standard
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user ? user.id : null;
}

export async function createPromotion(uid: string, data: CreatePromotionInput) {
    try {
        const supabase = await createClient();

        // 1. Validate Input
        const validated = CreatePromotionSchema.parse(data);

        // 2. Fetch Barbershop & Check Plan
        const barbershop = await getBarbershopByOwner(uid);
        if (!barbershop) {
            return { success: false, error: 'Barbershop not found' };
        }

        const plan = barbershop.subscription?.plan || 'basic'; // defaults

        const ALLOWED_PLANS = ['pro', 'premium', 'business', 'empire'];

        if (!ALLOWED_PLANS.includes(plan.toLowerCase())) {
            return { success: false, error: 'Upgrade to PRO to unlock Promotions' };
        }

        // 3. Create Promotion
        // Supabase Insert
        const promotionData: any = {
            barbershop_id: barbershop.id,
            ...validated,
            created_at: new Date().toISOString()
        };

        const { data: inserted, error } = await supabase
            .from(PROMOTIONS_TABLE)
            .insert([promotionData])
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/dashboard/promotions');

        return { success: true, promotion: { id: inserted.id, ...inserted } as Promotion };
    } catch (error) {
        console.error("Error creating promotion:", error);
        return { success: false, error: 'Failed to create promotion' };
    }
}

export async function getPromotions(barbershopId: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from(PROMOTIONS_TABLE)
            .select('*')
            .eq('barbershop_id', barbershopId);

        if (error) throw error;

        const promotions = (data || []).map(doc => ({
            id: doc.id,
            ...doc,
            barbershopId: doc.barbershop_id, // Map if necessary
            createdAt: doc.created_at
        } as unknown as Promotion));

        return { success: true, promotions };
    } catch (error) {
        console.error("Error fetching promotions:", error);
        return { success: false, error: 'Failed to fetch promotions' };
    }
}

export async function togglePromotion(promotionId: string, active: boolean) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from(PROMOTIONS_TABLE)
            .update({ active })
            .eq('id', promotionId);

        if (error) throw error;

        revalidatePath('/dashboard/promotions');
        return { success: true };
    } catch (error) {
        console.error("Error toggling promotion:", error);
        return { success: false, error: 'Failed to update promotion' };
    }
}
