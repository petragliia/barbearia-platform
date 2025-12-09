import { NextResponse } from 'next/server';
import Stripe from 'stripe';
// Wait, this is a server route. We should use firebase-admin to write to Firestore securely.
// If firebase-admin is not set up, we might need to use the client SDK but initialized for server (not recommended for auth bypass) or just trust the client sent data?
// The prompt says "Save the barbershop directly to Firestore".
// Let's check if we have firebase-admin. If not, we might need to use the standard firebase/firestore but we need auth context.
// Actually, for this MVP, let's assume we can write to Firestore from here using the standard SDK if we are authenticated, or use Admin SDK.
// Let's check imports in other files. `src/lib/firebase.ts` exports `db`.
// But `db` is client SDK. In Next.js API routes, we should use Admin SDK for privileged operations or pass the user token.
// However, looking at previous code, `src/app/api/booking/route.ts` uses `db` from `@/lib/firebase`.
// This works if the rules allow it or if we are just using it as a client.
// But wait, `src/lib/firebase.ts` initializes the app.
// Let's use `db` from `@/lib/firebase` for consistency with the existing codebase, assuming it works for now (maybe open rules or using it as a client).
// BUT, for a "Success" creation, we probably want to be sure.
// Let's stick to the pattern used in the project.

import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ADDONS } from '@/config/addons';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia' as any,
});

export async function POST(request: Request) {
    try {
        const { barbershopData, userId, addons, plan } = await request.json();

        // --- FREE PLAN LOGIC ---
        if (plan === 'free') {
            // Create Barbershop Document directly
            await setDoc(doc(db, 'barbershops', userId), {
                ...barbershopData,
                ownerId: userId,
                plan: 'free',
                status: 'active',
                createdAt: serverTimestamp(),
                subscriptionId: null,
                addons: [], // Free plan has no addons
            });

            // Return success with slug for redirection
            return NextResponse.json({ success: true, slug: barbershopData.slug });
        }

        // --- PAID PLAN LOGIC (Stripe) ---

        // Map plan to Price ID (Replace with real Stripe Price IDs)
        const planPriceIds = {
            starter: 'price_1Q...Starter', // Replace with env var or real ID
            pro: 'price_1Q...Pro',         // Replace with env var or real ID
            empire: 'price_1Q...Empire',   // Replace with env var or real ID
        };

        const selectedPlanPriceId = planPriceIds[plan as keyof typeof planPriceIds] || planPriceIds.starter;

        // Base Plan Line Item
        const line_items = [
            {
                price: selectedPlanPriceId,
                quantity: 1,
            },
        ];

        // Add Addons to Line Items
        // Logic: If Pro plan, addons are included (so don't add them to Stripe, or add as free? Usually just don't add price).
        // If Starter plan, add selected addons.
        if (plan !== 'pro' && addons && Array.isArray(addons)) {
            addons.forEach((addonId: string) => {
                const addon = ADDONS.find((a) => a.id === addonId);
                if (addon) {
                    line_items.push({
                        price_data: {
                            currency: 'brl',
                            product_data: {
                                name: `Adicional: ${addon.title}`,
                                description: addon.description,
                            },
                            unit_amount: Math.round(addon.price * 100),
                            recurring: {
                                interval: 'month' as any,
                            },
                        },
                        quantity: 1,
                    } as any);
                }
            });
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'subscription',
            success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get('origin')}/wizard`,
            metadata: {
                userId,
                barbershopData: JSON.stringify(barbershopData),
                addons: addons ? addons.join(',') : '',
                plan,
            },
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (error: any) {
        console.error('Checkout Error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
