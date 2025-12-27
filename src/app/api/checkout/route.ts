import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/features/subscription/services/stripeService';
import { authAdmin } from '@/lib/firebase-admin'; // Using admin auth to verify token if sent
// OR utilize standard Next.js session management if available.
// Since we are in App Router, we often use a cookie or a token passed in headers.
// However, 'src/lib/firebase-admin.ts' suggests we have admin capabilities.
// For client-called API, we should check the ID token.

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate User
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await authAdmin.verifyIdToken(idToken);
        const userId = decodedToken.uid;
        const userEmail = decodedToken.email;

        // 2. Parse Body
        const { priceId } = await req.json();
        if (!priceId) {
            return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
        }

        // 3. Create Checkout Session
        // Use the origin from the request or a configured base URL
        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const returnUrl = `${origin}/dashboard/billing`; // or wherever you want them to land

        const { url } = await createCheckoutSession(priceId, userId, userEmail, returnUrl);

        return NextResponse.json({ url });

    } catch (error: any) {
        console.error('Checkout API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
