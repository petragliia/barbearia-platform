import { NextRequest, NextResponse } from 'next/server';
import { createPortalSession } from '@/features/subscription/services/stripeService';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate User
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = user.id;

        // 2. Get User's Stripe Customer ID from Supabase
        // Ideally we should use a Service Role client to access profiles if RLS blocks reading it.
        // Or if the user can read their own profile, the standard client is fine.
        // We'll trust the user has read access to their own profile.
        // If not, we'd need SUPABASE_SERVICE_ROLE_KEY.

        const { data: userData, error: profileError } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', userId)
            .single();

        if (profileError || !userData) {
            // Fallback: try to see if it's in metadata (some implementations put it there)
            if (user.user_metadata?.stripe_customer_id) {
                // allow proceed
            } else {
                return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
            }
        }

        // Note: The previous code accessed `userData?.stripeCustomerId`.
        // Supabase often uses snake_case for DB columns.
        // Let's check if we can get it.
        const stripeCustomerId = userData?.stripe_customer_id || user.user_metadata?.stripe_customer_id || user.user_metadata?.stripeCustomerId;

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
