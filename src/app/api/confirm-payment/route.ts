import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia' as any,
});

export async function POST(request: Request) {
    try {
        const { sessionId } = await request.json();

        if (!sessionId) {
            return NextResponse.json({ message: 'Session ID required' }, { status: 400 });
        }

        // 1. Retrieve Session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return NextResponse.json({ message: 'Payment not paid' }, { status: 400 });
        }

        // 2. Retrieve Data from Metadata
        const userId = session.metadata?.userId;
        const barbershopDataString = session.metadata?.barbershopData;

        if (!userId || !barbershopDataString) {
            return NextResponse.json({ message: 'Missing metadata' }, { status: 400 });
        }

        const barbershopData = JSON.parse(barbershopDataString);

        // 3. Create Barbershop in Firestore (Server-Side Logic)
        // Note: We are using the client SDK 'db' here. In a real production app with strict rules,
        // we should use firebase-admin. However, for this MVP/Demo, assuming rules allow auth users or public write
        // (or if we are running in an environment that can authenticate), this might work.
        // Ideally, we'd use firebase-admin with a service account.

        // Check for uniqueness again just in case
        const barbershopsRef = collection(db, 'barbershops');
        const q = query(barbershopsRef, where('slug', '==', barbershopData.slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Edge case: Slug taken between checkout start and finish.
            // In a real app, we'd handle this gracefully (e.g. append random number).
            // For now, we'll proceed or error. Let's append a random string to save it anyway.
            barbershopData.slug = `${barbershopData.slug}-${Math.floor(Math.random() * 1000)}`;
        }

        const newDocRef = doc(barbershopsRef);
        const barbershopToSave = {
            ...barbershopData,
            id: newDocRef.id,
            ownerId: userId,
            createdAt: Timestamp.now(),
            status: 'active',
            stripeSessionId: sessionId, // Link payment
        };

        await setDoc(newDocRef, barbershopToSave);

        return NextResponse.json({ success: true, slug: barbershopData.slug });

    } catch (error: any) {
        console.error('Confirmation Error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
