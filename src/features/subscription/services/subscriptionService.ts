import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Subscription, PlanTier, SubscriptionStatus } from '../types';
import { STRIPE_PRICE_MAP } from '@/config/plans';

/**
 * Updates the user's subscription status in Supabase based on Stripe webhook events.
 */
export async function updateUserSubscription(
    stripeCustomerId: string,
    data: Partial<Subscription>,
    userId?: string
) {
    try {
        let finalUserId = userId;

        // 1. If no userId provided, lookup by stripe_customer_id in profiles/users table
        // We assume we store stripe_customer_id in 'profiles' or 'users' (metadata).
        // Let's assume 'profiles' table has it for now.

        if (!finalUserId) {
            const { data: userProfile, error } = await supabaseAdmin
                .from('profiles') // or check auth.users via listUsers (slow)
                .select('id')
                .eq('stripe_customer_id', stripeCustomerId)
                .single();

            if (userProfile) {
                finalUserId = userProfile.id;
            }
        }

        if (!finalUserId) {
            console.error(`[SubscriptionService] User not found for Stripe Customer ID: ${stripeCustomerId}`);
            return { success: false, error: 'User not found' };
        }

        // 2. Update user profile/subscription data
        // We likely store subscription info in 'profiles' or a separate 'subscriptions' table.
        // Based on previous code: `subscriptionStatus`, `isPremium`, `subscription` object were on user doc.
        // We map to 'profiles' columns.

        const updates = {
            subscription_status: data.status,
            is_premium: data.status === 'active' || data.status === 'trialing',
            stripe_customer_id: stripeCustomerId, // Ensure set
            // Store complex subscription object in a jsonb column if exists, or map fields
            subscription_data: {
                ...data,
                updatedAt: new Date().toISOString()
            }
        };

        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update(updates)
            .eq('id', finalUserId);

        if (updateError) throw updateError;

        // 3. Update Custom Claims (App Metadata in Supabase)
        /* 
           This allows us to check "app_metadata.is_premium" in RLS.
        */
        const isPremium = data.status === 'active' || data.status === 'trialing';

        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            finalUserId,
            { app_metadata: { is_premium: isPremium, plan: data.plan } }
        );

        if (authError) throw authError;

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
/**
 * Updates the user's Stripe Customer ID if it doesn't exist.
 */
export async function setStripeCustomerId(userId: string, stripeCustomerId: string) {
    try {
        const { error } = await supabaseAdmin
            .from('profiles')
            .update({ stripe_customer_id: stripeCustomerId })
            .eq('id', userId);

        if (error) throw error;
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
