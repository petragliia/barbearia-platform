'use server';


import { createClient } from '@/lib/supabase/server';
import { BarbershopSchema } from '@/lib/validators/barbershop';
import { BarbershopData } from '@/types/barbershop';
import { revalidatePath } from 'next/cache';

// COLLECTION REFERENCES
const BARBERSHOPS_TABLE = 'barbershops';

/**
 * Fetch a barbershop by its unique slug.
 * This is used for the public landing page.
 */
export async function getBarbershopBySlug(slug: string): Promise<BarbershopData | null> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from(BARBERSHOPS_TABLE)
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !data) {
            return null;
        }

        // Transform Postgres data to match BarbershopData interface
        return {
            id: data.id,
            ...data,
            ownerId: data.owner_id,
            isPublished: data.is_published,
            template_id: data.template_id,
        } as BarbershopData;
    } catch (error) {
        console.error("Error fetching barbershop by slug:", error);
        return null;
    }
}

/**
 * Fetch a barbershop by its Owner UID.
 * Used for the Dashboard initialization.
 */
export async function getBarbershopByOwner(uid: string): Promise<BarbershopData | null> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from(BARBERSHOPS_TABLE)
            .select('*')
            .eq('owner_id', uid) // Assuming mapping 'uid' in legacy to 'owner_id' in DB
            .single();

        if (error || !data) {
            return null;
        }

        return {
            id: data.id,
            ...data,
            ownerId: data.owner_id,
            isPublished: data.is_published,
            template_id: data.template_id,
        } as BarbershopData;
    } catch (error) {
        console.error("Error fetching barbershop by owner:", error);
        return null;
    }
}

/**
 * Update Barbershop Configuration.
 * Typically used within the dashboard.
 */
export async function updateBarbershopConfig(barbershopId: string, data: Partial<BarbershopData>) {
    // 1. Validate 'data' partially using Zod? 
    // Since it's partial, pure Zod validation might be tricky unless we use partial().

    try {
        const supabase = await createClient();

        // Map Keys
        const updateData: any = { ...data, updated_at: new Date().toISOString() };
        if (data.isPublished !== undefined) updateData.is_published = data.isPublished;
        if (data.ownerId) updateData.owner_id = data.ownerId;
        // prune keys that don't belong to schema if necessary, but Supabase ignores extra keys usually? 
        // No, it throws error on extra keys unless configured otherwise.
        // For now, assume keys match or mapped.

        // Remove mapped keys
        delete updateData.isPublished;
        delete updateData.ownerId;

        // 2. Perform Update
        const { error } = await supabase
            .from(BARBERSHOPS_TABLE)
            .update(updateData)
            .eq('id', barbershopId);

        if (error) throw error;

        // 3. Revalidate Paths
        // If we updated the slug or content, the public page needs revalidation
        if (data.slug) {
            revalidatePath(`/${data.slug}`); // Or dynamic route
        }

        return { success: true };
    } catch (error) {
        console.error("Error updating barbershop:", error);
        return { success: false, error: "Failed to update configuration" };
    }
}
