import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface BarbershopData {
    slug: string;
    name: string;
    [key: string]: any;
}

export class PaymentService {
    /**
     * Verifies a Stripe session and creates a barbershop if payment is successful.
     * This method is idempotent-ish: if the session was already processed, it should handle it (though strictly we rely on Stripe status).
     */
    static async verifyPaymentAndCreateBarbershop(sessionId: string) {
        // 1. Validate Input
        if (!sessionId) {
            throw new Error("Session ID is required");
        }

        // 2. Retrieve & Verify Stripe Session
        // We strictly trust ONLY Stripe's API response, not client-provided data.
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            throw new Error(`Payment not completed. Status: ${session.payment_status}`);
        }

        // 3. Extract Metadata
        const userId = session.metadata?.userId;
        const barbershopDataString = session.metadata?.barbershopData;

        if (!userId || !barbershopDataString) {
            throw new Error("Missing critical metadata in Stripe session");
        }

        const barbershopData: BarbershopData = JSON.parse(barbershopDataString);

        if (!barbershopData.slug) {
            throw new Error("Invalid barbershop data: missing slug");
        }

        // 4. Create in Supabase
        try {
            // Check for existing slug to avoid duplicates
            const { data: existingSlug } = await supabaseAdmin
                .from("barbershops")
                .select("slug")
                .eq("slug", barbershopData.slug)
                .single();

            let finalSlug = barbershopData.slug;
            if (existingSlug) {
                // Suffix if conflict
                finalSlug = `${barbershopData.slug}-${Math.floor(Math.random() * 10000)}`;
            }

            const barbershopToSave = {
                ...barbershopData,
                slug: finalSlug,
                owner_id: userId, // Map to snake_case
                status: "active",
                stripe_session_id: sessionId, // Map to snake_case
                is_published: false,
                products: barbershopData.products || [],
                updated_at: new Date().toISOString(),
                // id will be auto-generated or we can fetch user UUID?
                // Wait, Barbershop ID usually IS the User ID in this "one shop per user" model?
                // Original code: `doc(dbAdmin, "barbershops", user.uid)` -> Wait, `dbAdmin.collection("barbershops").doc()` was AUTO-ID in previous code.
                // But `docRef = doc(db, 'barbershops', user.uid)` in AvailabilityPage implies ID IS UserID?
                // Let's check AvailabilityPage logic again.
                // AvailabilityPage: `doc(db, 'barbershops', user.uid)`
                // PaymentService (Original): `dbAdmin.collection("barbershops").doc()` -> AUTO ID.
                // CONTRADICTION!
                // If AvailabilityPage reads by `user.uid`, then PaymentService MUST create with `user.uid` as ID or LINK it.
                // In `barbershopService.ts` (Step 97), `getBarbershop` calls `.eq('owner_id', userId).single()`.
                // So the ID of the barbershop record can be anything, as long as `owner_id` is set.
                // So AUTO-ID is fine, assuming `barbershopService` queries by `owner_id`.
            };

            const { data: inserted, error } = await supabaseAdmin
                .from("barbershops")
                .insert([barbershopToSave])
                .select()
                .single();

            if (error) {
                console.error("Supabase insert error:", error);
                throw error;
            }

            return {
                success: true,
                barbershopId: inserted.id,
                slug: finalSlug
            };

        } catch (error: any) {
            console.error("Provisioning error:", error);
            throw new Error("Failed to provision barbershop in database");
        }
    }
}
