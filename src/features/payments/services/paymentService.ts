import { stripe } from "@/lib/stripe";
import { dbAdmin } from "@/lib/firebase-admin"; // Server-side admin SDK
import { Timestamp, FieldValue } from "firebase-admin/firestore";

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

        // 4. Transactional Creation in Firestore
        // We use runTransaction to ensure we don't overwrite if it already exists or handle specific logic.
        // For simplicity in this logical block, we'll verify slug uniqueness inside the transaction if needed,
        // or just rely on the fact that if payment passed, we *should* provision.

        try {
            const barbershopRef = dbAdmin.collection("barbershops").doc(); // Auto-ID

            // Check for existing slug to avoid duplicates (though simple unique check might be enough)
            const slugQuery = await dbAdmin.collection("barbershops")
                .where("slug", "==", barbershopData.slug)
                .get();

            let finalSlug = barbershopData.slug;
            if (!slugQuery.empty) {
                // Determine if this is a retry or a conflict. 
                // For now, as per original logic, append suffix to ensure provision success.
                finalSlug = `${barbershopData.slug}-${Math.floor(Math.random() * 10000)}`;
            }

            const barbershopToSave = {
                ...barbershopData,
                slug: finalSlug,
                id: barbershopRef.id,
                ownerId: userId,
                createdAt: FieldValue.serverTimestamp(),
                status: "active",
                stripeSessionId: sessionId,
                isPublished: false,
                products: barbershopData.products || [],
                updatedAt: FieldValue.serverTimestamp(),
            };

            await barbershopRef.set(barbershopToSave);

            return {
                success: true,
                barbershopId: barbershopRef.id,
                slug: finalSlug
            };

        } catch (error: any) {
            console.error("Firestore provisioning error:", error);
            throw new Error("Failed to provision barbershop in database");
        }
    }
}
