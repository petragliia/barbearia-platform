import { loadStripe } from '@stripe/stripe-js';
import { BarbershopData } from '@/types/barbershop';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export async function createCheckoutSession(barbershopData: BarbershopData, userId: string, addons: string[] = [], plan: string = 'starter') {
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                barbershopData,
                userId,
                addons,
                plan,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao iniciar pagamento');
        }

        const { sessionId, success, slug } = await response.json();

        // If Free Plan (no session ID, just success)
        if (success && slug) {
            window.location.href = `/dashboard`; // Or success page
            return;
        }

        const stripe = await stripePromise;

        if (!stripe) {
            throw new Error('Erro ao carregar Stripe');
        }

        const { error } = await (stripe as any).redirectToCheckout({
            sessionId,
        });

        if (error) {
            throw error;
        }

    } catch (error: any) {
        console.error('Checkout Error:', error);
        throw error;
    }
}
