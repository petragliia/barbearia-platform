import { createClient } from '@supabase/supabase-js';

// Accessing Service Role Key - SECURITY WARNING: Never expose this to client!
// Process.env lookup usually safe in server files.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceKey) {
    // throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
    // Warn instead of throw to avoid breaking build if env not fully set yet
    console.warn("Missing SUPABASE_SERVICE_ROLE_KEY - Admin operations will fail.");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || '', {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
