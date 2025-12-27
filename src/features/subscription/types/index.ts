export type SubscriptionStatus =
    | 'active'
    | 'past_due'
    | 'unpaid'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing';

export type PlanTier = 'FREE' | 'STARTER' | 'PRO' | 'BUSINESS';

export interface Subscription {
    plan: PlanTier;
    status: SubscriptionStatus;
    currentPeriodEnd: number; // Unix timestamp
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    cancelAtPeriodEnd?: boolean;
}

export interface StripeEvent {
    id: string;
    type: string;
    data: {
        object: any;
    };
}

export const PLAN_LIMITS = {
    FREE: {
        services: 3,
        features: [],
    },
    STARTER: {
        services: 10,
        features: ['scheduling'],
    },
    PRO: {
        services: 999,
        features: ['scheduling', 'marketing', 'domain'],
    },
    BUSINESS: {
        services: 999,
        features: ['scheduling', 'marketing', 'domain', 'products', 'api'],
    },
};
