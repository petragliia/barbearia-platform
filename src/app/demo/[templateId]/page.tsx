import { notFound } from 'next/navigation';
import DemoWrapper from '@/features/demo/components/DemoWrapper';
import { BarbershopData } from '@/types/barbershop';

// Mock data for pure template demos (generic content)
const DEMO_DATA: BarbershopData = {
    id: 'demo',
    slug: 'demo',
    template_id: 'classic', // will be overridden
    content: {
        name: 'Barbearia Modelo',
        description: 'Experimente a qualidade e o estilo que você merece.',
        hero_image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop',
        colors: {
            primary: '#1a1a1a',
            secondary: '#d4af37',
            accent: '#ffffff'
        },
        contact: {
            phone: '(11) 99999-9999',
            address: 'Rua Exemplo, 123 - Centro',
            whatsapp: '5511999999999'
        }
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

    // Adjust colors/images slightly based on template for better preview
    if (templateId === 'modern') {
        data.content.colors.secondary = '#38bdf8';
        data.content.hero_image = 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop';
    } else if (templateId === 'urban') {
        data.content.colors.secondary = '#ef4444';
        data.content.hero_image = 'https://images.unsplash.com/photo-1593702295094-380734e4a82a?q=80&w=2065&auto=format&fit=crop';
    }

    if (!['classic', 'modern', 'urban'].includes(templateId)) {
        return notFound();
    }

    return (
        <DemoWrapper initialData={data} templateId={templateId} />
    );
}
