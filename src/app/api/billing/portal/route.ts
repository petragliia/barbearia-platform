import { NextRequest, NextResponse } from 'next/server';
import { createPortalSession } from '@/features/subscription/services/stripeService';
import { authAdmin, dbAdmin } from '@/lib/firebase-admin';

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

        // 2. Get User's Stripe Customer ID from Firestore
        const userDoc = await dbAdmin.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userData = userDoc.data();
        const stripeCustomerId = userData?.stripeCustomerId;

        if (!stripeCustomerId) {
            return NextResponse.json({ error: 'No billing account found' }, { status: 400 });
        }

        // 3. Create Portal Session
        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const returnUrl = `${origin}/dashboard/billing`; // Redirect back to billing page

        const { url } = await createPortalSession(stripeCustomerId, returnUrl);

        return NextResponse.json({ url });

    } catch (error: any) {
        console.error('Portal API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
