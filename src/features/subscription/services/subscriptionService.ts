import 'server-only';
import { dbAdmin } from '@/lib/firebase-admin';
import { Subscription, PlanTier, SubscriptionStatus } from '../types';
import { STRIPE_PRICE_MAP } from '@/config/plans';

/**
 * Updates the user's subscription status in Firestore based on Stripe webhook events.
 */
export async function updateUserSubscription(
    stripeCustomerId: string,
    data: Partial<Subscription>,
    userId?: string
) {
    try {
        let userDoc;

        // 1. If explicit userId provided (e.g. from session metadata), use it first.
        // This handles race conditions where stripeCustomerId might not be in Firestore yet.
        if (userId) {
            const docRef = dbAdmin.collection('users').doc(userId);
            const docSnapshot = await docRef.get();
            if (docSnapshot.exists) {
                userDoc = docSnapshot;
                // Ensure stripeCustomerId is set if missing
                if (data.stripeCustomerId && docSnapshot.data()?.stripeCustomerId !== data.stripeCustomerId) {
                    await docRef.update({ stripeCustomerId: data.stripeCustomerId });
                }
            }
        }

        // 2. If no userId found/provided, fallback to searching by stripeCustomerId
        if (!userDoc) {
            const usersRef = dbAdmin.collection('users');
            const snapshot = await usersRef
                .where('stripeCustomerId', '==', stripeCustomerId)
                .limit(1)
                .get();

            if (!snapshot.empty) {
                userDoc = snapshot.docs[0];
            }
        }

        if (!userDoc) {
            console.error(`[SubscriptionService] User not found for Stripe Customer ID: ${stripeCustomerId} (User ID provided: ${userId})`);
            return { success: false, error: 'User not found' };
        }

        const finalUserId = userDoc.id;

        // 3. Update user document
        await userDoc.ref.update({
            subscriptionStatus: data.status, // Root level field for easy querying
            isPremium: data.status === 'active' || data.status === 'trialing',
            subscription: {
                ...data,
                updatedAt: new Date().toISOString(),
            },
        });

        // 4. Update Custom Claims
        /* 
           This allows us to check "request.auth.token.isPremium" in Security Rules 
           and "user.claims.isPremium" in Client SDK. 
        */
        const isPremium = data.status === 'active' || data.status === 'trialing';
        await import('@/lib/firebase-admin').then(({ authAdmin }) =>
            authAdmin.setCustomUserClaims(finalUserId, { isPremium, plan: data.plan })
        );

        console.log(`[SubscriptionService] Updated subscription for user ${finalUserId}. Premium: ${isPremium}`);
        return { success: true };
    } catch (error) {
        console.error('[SubscriptionService] Error updating user subscription:', error);
        throw error;
    }
}

/**
 * Updates the user's Stripe Customer ID if it doesn't exist.
 */
export async function setStripeCustomerId(userId: string, stripeCustomerId: string) {
    try {
        await dbAdmin.collection('users').doc(userId).update({
            stripeCustomerId: stripeCustomerId
        });
    } catch (error) {
        console.error('Error setting stripe customer ID:', error);
        throw error;
    }
}

/**
 * Map Stripe Price ID to Plan Tier
 */
export function getPlanFromPriceId(priceId: string): PlanTier {
    const plan = STRIPE_PRICE_MAP[priceId];
    return plan || 'FREE';
}
