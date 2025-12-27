import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/features/subscription/services/stripeService';
import { updateUserSubscription, setStripeCustomerId, getPlanFromPriceId } from '@/features/subscription/services/subscriptionService';
import { SubscriptionStatus } from '@/features/subscription/types';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    let event;

    try {
        event = await constructWebhookEvent(body, signature);
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as any;
                const userId = session.metadata?.userId;
                const customerId = session.customer;

                if (userId && customerId) {
                    await setStripeCustomerId(userId, customerId as string);
                }
                break;
            }
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as any;
                const customerId = invoice.customer as string;
                const subscriptionId = invoice.subscription as string;

                if (subscriptionId) {
                    // Fetch latest subscription status to be sure
                    const { stripe } = await import('@/lib/stripe');
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                    const status = subscription.status as SubscriptionStatus;
                    const priceId = subscription.items.data[0].price.id;
                    const currentPeriodEnd = (subscription as any).current_period_end;
                    const userId = subscription.metadata?.userId;

                    const plan = getPlanFromPriceId(priceId);

                    await updateUserSubscription(customerId, {
                        plan,
                        status,
                        currentPeriodEnd,
                        stripeSubscriptionId: subscriptionId,
                        stripeCustomerId: customerId,
                    }, userId);
                }
                break;
            }
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as any;
                const status = subscription.status as SubscriptionStatus;
                const priceId = subscription.items.data[0].price.id;
                const currentPeriodEnd = subscription.current_period_end;
                const customerId = subscription.customer as string;
                const userId = subscription.metadata?.userId;

                // Map price ID to PlanTier
                const plan = getPlanFromPriceId(priceId);

                await updateUserSubscription(customerId, {
                    plan,
                    status,
                    currentPeriodEnd,
                    stripeSubscriptionId: subscription.id,
                    stripeCustomerId: customerId,
                }, userId);
                break;
            }
            default:
            // Unhandled event type
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error(`Error handling webhook event: ${err.message}`);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}
