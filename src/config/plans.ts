export interface Plan {
    id: 'free' | 'starter' | 'pro';
    name: string;
    price: number; // in cents
    features: string[];
    recommended?: boolean;
}

export const PLANS: Plan[] = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        features: ['Subdomínio', 'Botão WhatsApp', 'Anúncios no Rodapé'],
    },
    {
        id: 'starter',
        name: 'Starter',
        price: 2990,
        features: ['Domínio Próprio', 'Sem Anúncios', 'Hospedagem Premium'],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 6990,
        features: ['Tudo do Starter', 'Agendamento Incluso', 'SEO Local Incluso', 'Design 3D Incluso'],
        recommended: true,
    },
];
