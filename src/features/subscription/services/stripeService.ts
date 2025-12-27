import 'server-only';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function createCheckoutSession(
    priceId: string,
    userId: string,
    customerEmail: string | undefined, // Pass email to pre-fill
    returnUrl: string
) {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            metadata: {
                userId,
            },
            customer_email: customerEmail,
            success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${returnUrl}?canceled=true`,
            subscription_data: {
                metadata: {
                    userId
                }
            }
        });

        return { sessionId: session.id, url: session.url };
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
}

export async function constructWebhookEvent(body: string, signature: string) {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not set');
    }
    return stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
}

export async function createPortalSession(
    stripeCustomerId: string,
    returnUrl: string
) {
    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: returnUrl,
        });

        return { url: session.url };
    } catch (error) {
        console.error('Error creating portal session:', error);
        throw error;
    }
}
