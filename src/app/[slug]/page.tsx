import { notFound } from 'next/navigation';
import { BarbershopData } from '@/types/barbershop';
import TemplateClassic from '@/features/templates/components/TemplateClassic';
import TemplateModern from '@/features/templates/components/TemplateModern';
import TemplateUrban from '@/features/templates/components/TemplateUrban';
import { getBarbershopBySlug } from '@/features/barbershops/services/serverBarbershopService';

export default async function PublicBarberPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    console.log('Buscando slug:', slug);

    const data = await getBarbershopBySlug(slug);

    if (!data) {
        console.log('Nenhuma barbearia encontrada para o slug:', slug);
        notFound();
    }

    // Logic for "Dev Mode" (Bypass)
    const isDev = process.env.NODE_ENV === 'development';

    if (!isDev && !data.isPublished) {
        console.log('Barbearia nao publicada (producao):', slug);
        notFound();
    }

    // Render the Template
    // Check template_id and render the corresponding component
    switch (data.template_id) {
        case 'urban':
            return <TemplateUrban data={data} />;
        case 'classic':
            return <TemplateClassic data={data} />;
        case 'modern':
            return <TemplateModern data={data} />;
        default:
            // Fallback if template_id is missing or unknown
            console.warn(`Template desconhecido: ${data.template_id}, usando fallback (Modern).`);
            return <TemplateModern data={data} />;
    }
}
