import { productService } from "@/features/products/services/productService";
import { getBarbershopById } from "@/lib/services/barbershopService";

export class PlanLimitExceededError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PlanLimitExceededError";
    }
}

const PLAN_LIMITS: Record<string, number> = {
    basic: 5,     // STARTER
    pro: 25,      // PRO
    premium: Infinity // EMPIRE
};

/**
 * Checks if a barber has reached their product limit based on their subscription plan.
 * @param barberId The ID of the barbershop/user
 * @throws PlanLimitExceededError if the limit is reached
 */
export async function checkProductLimit(barberId: string): Promise<void> {
    // 1. Fetch Barbershop Data to get the plan
    const barbershop = await getBarbershopById(barberId);

    if (!barbershop) {
        throw new Error("Barbershop not found");
    }

    // Default to 'basic' if no plan is set
    const currentPlan = barbershop.subscription?.plan || 'basic';
    const limit = PLAN_LIMITS[currentPlan] ?? 5; // Fallback to 5 if unknown

    // If limit is Infinity, we don't need to count
    if (limit === Infinity) return;

    // 2. Count current products
    // Ideally we would have a dedicated count method in the service to avoid fetching all data, 
    // but for now we'll use getProductsByBarberId.
    const products = await productService.getProductsByBarberId(barberId);
    const splitCount = products.length;

    if (splitCount >= limit) {
        throw new PlanLimitExceededError(
            `You have reached the limit of ${limit} products for your current ${currentPlan.toUpperCase()} plan. Upgrade to add more.`
        );
    }
}
