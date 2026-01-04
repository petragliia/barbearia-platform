export type PlanTier = 'FREE' | 'STARTER' | 'PRO' | 'BUSINESS';

export interface Plan {
    id: Lowercase<PlanTier>;
    name: string;
    tier: PlanTier;
    price: number; // in cents
    features: string[];
    recommended?: boolean;
    stripePriceId?: string; // Production Price ID
}

export const PLAN_FEATURES = {
    FREE: {
        onlineBooking: false,
        customDomain: false,
        products: false,
        aiCopywriting: false,
        maxServices: 3
    },
    STARTER: {
        onlineBooking: true,
        customDomain: false,
        products: false,
        aiCopywriting: false,
        maxServices: 10
    },
    PRO: {
        onlineBooking: true,
        customDomain: true,
        products: false,
        aiCopywriting: false,
        maxServices: 99
    },
    BUSINESS: {
        onlineBooking: true,
        customDomain: true,
        products: true,
        aiCopywriting: true,
        maxServices: 99
    }
} as const;

export type FeatureKey = keyof typeof PLAN_FEATURES['FREE'];

export const VISIBLE_PLANS: Plan[] = [
    {
        id: 'free',
        tier: 'FREE',
        name: 'Gratuito',
        price: 0,
        features: ['Subdomínio', 'Botão WhatsApp', 'Anúncios no Rodapé', 'Até 3 Serviços'],
    },
    {
        id: 'starter',
        tier: 'STARTER',
        name: 'Starter',
        price: 2990,
        features: ['Agendamento Online', 'Sem Anúncios', 'Até 10 Serviços', 'Hospedagem Premium'],
        stripePriceId: 'price_1SZpnxCGyOLUmg5bIi0q7EAI'
    },
    {
        id: 'pro',
        tier: 'PRO',
        name: 'Pro',
        price: 9700,
        features: ['Domínio Próprio', 'Serviços Ilimitados', 'SEO Local', 'Design 3D'],
        recommended: true,
        stripePriceId: 'price_1SZpoQCGyOLUmg5bnabARqlP'
    },
    {
        id: 'business',
        tier: 'BUSINESS',
        name: 'Business',
        price: 14990,
        features: ['Tudo do Pro', 'Venda de Produtos', 'Gestão de Estoque', 'Fidelidade Digital'],
        stripePriceId: 'price_1ScbzUCGyOLUmg5b8itiJO9S'
    }
];

// Helper to check boolean permissions
export function canUser(userPlan: PlanTier | undefined, feature: Exclude<FeatureKey, 'maxServices'>): boolean {
    const plan = userPlan || 'FREE';
    const features = PLAN_FEATURES[plan];
    // Safety check just in case
    if (!features) return PLAN_FEATURES['FREE'][feature] as boolean;
    return features[feature] as boolean;
}

export function getLimit(userPlan: PlanTier | undefined, limit: 'maxServices'): number {
    const plan = userPlan || 'FREE';
    // Explicitly accessing mapped limit with type assertion
    return (PLAN_FEATURES[plan][limit] as number) ?? 0;
}

// Map Stripe Price IDs to Plan Tiers
export const STRIPE_PRICE_MAP: Record<string, PlanTier> = {
    'price_1SZpnxCGyOLUmg5bIi0q7EAI': 'STARTER',
    'price_1SZpoQCGyOLUmg5bnabARqlP': 'PRO',
    'price_1ScbzUCGyOLUmg5b8itiJO9S': 'BUSINESS'
};
