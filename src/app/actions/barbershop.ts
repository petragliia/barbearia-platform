'use server';

import { dbAdmin } from '@/lib/firebase-admin';
import { BarbershopSchema } from '@/lib/validators/barbershop';
import { BarbershopData } from '@/types/barbershop';
import { revalidatePath } from 'next/cache';

// COLLECTION REFERENCES
const BARBERSHOPS_COLLECTION = 'barbershops';

/**
 * Fetch a barbershop by its unique slug.
 * This is used for the public landing page.
 */
export async function getBarbershopBySlug(slug: string): Promise<BarbershopData | null> {
    try {
        const snapshot = await dbAdmin.collection(BARBERSHOPS_COLLECTION)
            .where('slug', '==', slug)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        // Transform Firestore data to match BarbershopData interface
        // (Firestore timestamps might need conversion if we strictly defined Dates in interface, 
        // but current BarbershopData mocks don't seem to enforce Dates yet - relying on JSON serializable types)

        return {
            id: doc.id,
            ...data
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
        const snapshot = await dbAdmin.collection(BARBERSHOPS_COLLECTION)
            .where('uid', '==', uid)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as BarbershopData;
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
    // Let's validate key fields if present.

    try {
        // Optimistic validation: parse what we can
        // const validation = BarbershopSchema.partial().safeParse(data);
        // if (!validation.success) {
        //    throw new Error("Validation Failed");
        // }

        // 2. Perform Update
        await dbAdmin.collection(BARBERSHOPS_COLLECTION).doc(barbershopId).update({
            ...data,
            updatedAt: new Date().toISOString()
        });

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
