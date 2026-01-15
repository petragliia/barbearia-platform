import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/features/subscription/services/stripeService';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate User
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized', details: error }, { status: 401 });
        }

        const userId = user.id;
        const userEmail = user.email!;

        // 2. Parse Body
        const { priceId } = await req.json();
        if (!priceId) {
            return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
        }

        // 3. Create Checkout Session
        // Use the origin from the request or a configured base URL
        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const returnUrl = `${origin}/dashboard/billing`;

        const { url } = await createCheckoutSession(priceId, userId, userEmail, returnUrl);

        return NextResponse.json({ url });

    } catch (error: any) {
        console.error('Checkout API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
