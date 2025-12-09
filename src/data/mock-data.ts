import { BarbershopData } from '@/types/barbershop';

export const MOCK_BARBERSHOPS: Record<string, BarbershopData> = {
    'barbearia-do-tonio': {
        id: '1',
        slug: 'barbearia-do-tonio',
        template_id: 'classic',
        content: {
            name: 'Barbearia do Tônio',
            description: 'Tradição e estilo desde 1990.',
            hero_image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop',
            colors: {
                primary: '#1a1a1a',
                secondary: '#d4af37', // Gold
            },
            contact: {
                phone: '(11) 99999-9999',
                address: 'Rua Augusta, 123 - SP',
                whatsapp: '5511999999999',
            },
        },
        services: [
            { name: 'Corte Clássico', price: 45, duration: '45 min' },
            { name: 'Barba Completa', price: 35, duration: '30 min' },
            { name: 'Combo (Corte + Barba)', price: 70, duration: '1h 15min' },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1503951914875-452162b7f304?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1634480484131-134864122d3d?q=80&w=2070&auto=format&fit=crop', // New Image
        ],
    },
    'cyber-cuts': {
        id: '2',
        slug: 'cyber-cuts',
        template_id: 'modern',
        content: {
            name: 'Cyber Cuts',
            description: 'Cortes modernos e ambiente high-tech.',
            hero_image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop',
            colors: {
                primary: '#0f172a',
                secondary: '#38bdf8', // Sky Blue
            },
            contact: {
                phone: '(11) 98888-8888',
                address: 'Av. Paulista, 2000 - SP',
                whatsapp: '5511988888888',
            },
        },
        services: [
            { name: 'Corte Moderno', price: 60, duration: '50 min' },
            { name: 'Pigmentação', price: 40, duration: '30 min' },
            { name: 'Platinado', price: 120, duration: '2h' },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop',
        ],
    },
    'urban-style': {
        id: '3',
        slug: 'urban-style',
        template_id: 'urban',
        content: {
            name: 'Urban Style',
            description: 'Para quem vive a cidade intensamente.',
            hero_image: 'https://images.unsplash.com/photo-1593702295094-380734e4a82a?q=80&w=2065&auto=format&fit=crop',
            colors: {
                primary: '#262626',
                secondary: '#ef4444', // Red
            },
            contact: {
                phone: '(11) 97777-7777',
                address: 'Rua dos Pinheiros, 500 - SP',
                whatsapp: '5511977777777',
            },
        },
        services: [
            { name: 'Degradê Navalhado', price: 50, duration: '45 min' },
            { name: 'Freestyle', price: 80, duration: '1h' },
            { name: 'Sobrancelha', price: 20, duration: '15 min' },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1512690459411-b9245aed6191?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1520338661084-680395057c93?q=80&w=2070&auto=format&fit=crop',
        ],
    },
};
