import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import TemplateClassic from '@/features/templates/components/TemplateClassic';
import TemplateModern from '@/features/templates/components/TemplateModern';
import TemplateUrban from '@/features/templates/components/TemplateUrban';
import { BarbershopData } from '@/types/barbershop';
import FAQSection from '@/components/ui/FAQSection';
import ContactSection from '@/components/ui/ContactSection';
import GreetingFeature from '@/components/features/GreetingFeature';

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Force dynamic rendering to ensure we always fetch the latest data
export const dynamic = 'force-dynamic';

export default async function BarberPage({ params }: PageProps) {
    const { slug } = await params;

    try {
        const q = query(collection(db, 'barbershops'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            notFound();
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data() as BarbershopData;

        // Ensure template_id exists, fallback to classic if missing
        const templateId = data.template_id || 'classic';

        let TemplateComponent;
        switch (templateId) {
            case 'classic': TemplateComponent = TemplateClassic; break;
            case 'modern': TemplateComponent = TemplateModern; break;
            case 'urban': TemplateComponent = TemplateUrban; break;
            default: TemplateComponent = TemplateClassic; break;
        }

        return (
            <div className="bg-white">
                <GreetingFeature />
                <TemplateComponent data={data} />
                {data.faq && <FAQSection faq={data.faq} />}
                <ContactSection contact={data.content.contact} />
            </div>
        );
    } catch (error) {
        console.error("Error fetching barbershop:", error);
        notFound();
    }
}
