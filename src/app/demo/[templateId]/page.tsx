import { notFound } from 'next/navigation';
import DemoWrapper from '@/features/demo/components/DemoWrapper';
import { BarbershopData } from '@/types/barbershop';

// Mock data for pure template demos (generic content)
const DEMO_DATA: BarbershopData = {
    id: 'demo',
    uid: 'demo-uid',
    slug: 'demo',
    template_id: 'classic', // will be overridden
    isPublished: true,
    products: [],
    name: 'Barbearia Modelo',
    colors: {
        primary: '#d4af37', // Gold for Classic
        secondary: '#000000',
        background: '#0a0a0a',
        text: '#d4af37'
    },
    contact: {
        phone: '(11) 99999-9999',
        address: 'Rua Exemplo, 123 - Centro',
        whatsapp: '5511999999999'
    },
    content: {
        description: 'Experimente a qualidade e o estilo que você merece.',
        hero_image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop',
    },
    services: [
        { name: 'Corte de Cabelo', price: 50, duration: '45 min' },
        { name: 'Barba Completa', price: 35, duration: '30 min' },
        { name: 'Combo (Cabelo + Barba)', price: 75, duration: '1h 15min' },
    ],
    gallery: [
        'https://images.unsplash.com/photo-1503951914875-452162b7f304?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop',
    ]
};

export function generateStaticParams() {
    return [
        { templateId: 'classic' },
        { templateId: 'modern' },
        { templateId: 'urban' },
    ];
}

export default async function DemoPage({ params }: { params: Promise<{ templateId: string }> }) {
    const { templateId } = await params;

    // Override template_id in mock data
    const data = { ...DEMO_DATA, template_id: templateId as any };

    // Adjust colors/images based on template
    if (templateId === 'modern') {
        data.colors = {
            primary: '#111827',
            secondary: '#38bdf8',
            background: '#ffffff',
            text: '#111827'
        };
        data.content.hero_image = 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop';
    } else if (templateId === 'urban') {
        data.colors = {
            primary: '#ef4444',
            secondary: '#00F0FF',
            background: '#050505',
            text: '#ffffff'
        };
        data.content.hero_image = 'https://images.unsplash.com/photo-1593702295094-380734e4a82a?q=80&w=2065&auto=format&fit=crop';
    }

    if (!['classic', 'modern', 'urban'].includes(templateId)) {
        return notFound();
    }

    return (
        <DemoWrapper initialData={data} templateId={templateId} />
    );
}
