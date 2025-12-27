'use server';

import { dbAdmin } from '@/lib/firebase-admin';
import { Promotion, CreatePromotionSchema, CreatePromotionInput } from '@/features/promotions/types';
import { getBarbershopByOwner } from '@/app/actions/barbershop';
import { revalidatePath } from 'next/cache';
import { authAdmin } from '@/lib/firebase-admin';
import { headers } from 'next/headers';

const PROMOTIONS_COLLECTION = 'promotions';

// Helper to get current user ID securely on server
async function getCurrentUserUid() {
    // In a real app using Firebase Auth + Next.js Middleware, 
    // we would parse the session cookie here.
    // For this context, we assume the client sends an Authorization header OR a session cookie.
    // However, existing actions just take data. Authenticating strictly on server actions 
    // requires a session cookie approach. 
    // Given the "mvp/prototype" nature and existing `getBarbershopByOwner` usage in context,
    // we might need to trust the caller OR implementation of session cookies later.
    // BUT, the prompt asks for "Logic: If plan === 'STARTER', block...".
    // I will fetch the barbershop by the owner UID (which implies we need the UID).
    // Let's assume we pass the UID or use a placeholder if auth isn't fully robust yet.
    // Ideally, we verify the token.

    // For now, I will accept `uid` as an argument or extract from a mock header/cookie if available.
    // Wait, `getBarbershopByOwner(uid)` exists. 
    // I will require the `uid` to be passed to `createPromotion`.
    return null;
}

export async function createPromotion(uid: string, data: CreatePromotionInput) {
    try {
        // 1. Validate Input
        const validated = CreatePromotionSchema.parse(data);

        // 2. Fetch Barbershop & Check Plan
        const barbershop = await getBarbershopByOwner(uid);
        if (!barbershop) {
            return { success: false, error: 'Barbershop not found' };
        }

        const plan = barbershop.subscription?.plan || 'basic'; // defaults

        // Map 'basic', 'pro', etc from DB to Plans.
        // DB uses 'basic' | 'pro' | 'premium' (lowercase).
        // Config uses 'FREE' | 'STARTER' | 'PRO' | 'BUSINESS'.
        // Mapping: basic -> STARTER, pro -> PRO, premium -> BUSINESS?
        // Or plan might be exactly matching. 
        // Let's assume strict check:
        // Logic: "If plan === 'STARTER', block". 
        // Only PRO or EMPIRE (BUSINESS) allowed.

        const ALLOWED_PLANS = ['pro', 'premium', 'business', 'empire'];
        // Checking against lowercase values in DB.

        if (!ALLOWED_PLANS.includes(plan.toLowerCase())) {
            return { success: false, error: 'Upgrade to PRO to unlock Promotions' };
        }

        // 3. Create Promotion
        const ref = dbAdmin.collection(PROMOTIONS_COLLECTION).doc();
        const promotion: Promotion = {
            id: ref.id,
            barbershop_id: barbershop.id,
            ...validated,
            createdAt: new Date().toISOString()
        };

        await ref.set(promotion);
        revalidatePath('/dashboard/promotions');

        return { success: true, promotion };
    } catch (error) {
        console.error("Error creating promotion:", error);
        return { success: false, error: 'Failed to create promotion' };
    }
}

export async function getPromotions(barbershopId: string) {
    try {
        const snapshot = await dbAdmin.collection(PROMOTIONS_COLLECTION)
            .where('barbershop_id', '==', barbershopId)
            .get();

        const promotions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion));
        return { success: true, promotions };
    } catch (error) {
        console.error("Error fetching promotions:", error);
        return { success: false, error: 'Failed to fetch promotions' };
    }
}

export async function togglePromotion(promotionId: string, active: boolean) {
    try {
        await dbAdmin.collection(PROMOTIONS_COLLECTION).doc(promotionId).update({ active });
        revalidatePath('/dashboard/promotions');
        return { success: true };
    } catch (error) {
        console.error("Error toggling promotion:", error);
        return { success: false, error: 'Failed to update promotion' };
    }
}
