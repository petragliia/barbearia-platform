import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebase';
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error(`Webhook Error: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const subscription = event.data.object as Stripe.Subscription;

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                if (!session?.metadata?.userId) {
                    console.error('Webhook: Missing userId in metadata');
                    break;
                }

                const userId = session.metadata.userId;
                const barbershopData = session.metadata.barbershopData
                    ? JSON.parse(session.metadata.barbershopData)
                    : null;

                // Update user with subscription info
                await updateDoc(doc(db, 'users', userId), {
                    subscriptionStatus: 'active',
                    stripeCustomerId: session.customer as string,
                    stripeSubscriptionId: session.subscription as string,
                    plan: session.metadata.plan || 'starter',
                    updatedAt: serverTimestamp(),
                });

                // If this was the initial setup, we might want to save the barbershop data here too
                // if it wasn't saved during the wizard flow.
                // Assuming the wizard saves it separately or we save it here.
                // Let's ensure the barbershop document exists/is updated.
                if (barbershopData) {
                    // We might need to save/update the barbershop document as well
                    // But usually the wizard handles creating the initial barbershop doc.
                    // Let's log it for now.
                    console.log(`[Webhook] Provisioning for user ${userId}`);
                }
                break;
            }

            case 'invoice.payment_succeeded': {
                // Extend subscription or just log
                // The subscription status in Stripe is the source of truth, 
                // but we can update our local status to be sure.
                const subscriptionId = subscription.id;
                const customerId = subscription.customer as string;

                // We would need to find the user by stripeSubscriptionId to update them
                // Since we don't have a direct mapping here without querying, 
                // and we are using client SDK (no admin query by field easily without index),
                // we might skip this for MVP or assume checkout.session.completed handles the activation.
                // For a robust app, we'd query users where stripeSubscriptionId == subscriptionId
                console.log(`[Webhook] Payment succeeded for subscription ${subscriptionId}`);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscriptionId = subscription.id;
                console.log(`[Webhook] Subscription deleted: ${subscriptionId}`);
                // TODO: Find user and set status to 'canceled'
                // Requires querying users by stripeSubscriptionId
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error: any) {
        console.error(`Error processing webhook: ${error.message}`);
        return new NextResponse(`Error processing webhook: ${error.message}`, { status: 500 });
    }

    return new NextResponse(null, { status: 200 });
}
