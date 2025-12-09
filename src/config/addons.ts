import { Calendar, Sparkles, Map, Bell } from 'lucide-react';

export interface Addon {
    id: string;
    stripePriceId: string; // Placeholder for now
    title: string;
    description: string;
    price: number;
    icon: any; // Lucide icon component
}

export const ADDONS: Addon[] = [
    {
        id: 'scheduling',
        stripePriceId: 'price_scheduling_placeholder',
        title: 'Sistema de Agendamento',
        description: 'Receba agendamentos online 24h.',
        price: 50.00,
        icon: Calendar
    },
    {
        id: 'visual_premium',
        stripePriceId: 'price_visual_premium_placeholder',
        title: 'Pacote Visual Premium',
        description: 'Efeitos 3D, Motion e Partículas.',
        price: 20.00,
        icon: Sparkles
    },
    {
        id: 'maps_pro',
        stripePriceId: 'price_maps_pro_placeholder',
        title: 'Google Maps Pro',
        description: 'Mapa interativo com rotas no rodapé.',
        price: 20.00,
        icon: Map
    },
    {
        id: 'notifications',
        stripePriceId: 'price_notifications_placeholder',
        title: 'Sistema de Notificação',
        description: 'Notifique clientes via Email e WhatsApp.',
        price: 35.00,
        icon: Bell
    }
];
