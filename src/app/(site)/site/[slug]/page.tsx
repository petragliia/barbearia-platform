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
import PageViewTracker from '@/components/features/PageViewTracker';
import ShopSection from '@/features/shop/components/ShopSection';
import CartDrawer from '@/features/cart/components/CartDrawer';
import CartFloatingButton from '@/components/ui/CartFloatingButton';

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Force dynamic rendering to ensure we always fetch the latest data
export const dynamic = 'force-dynamic';

export default async function BarberPage({ params }: PageProps) {
    const { slug } = await params;
    console.log('[BarberPage] Rendering for slug:', slug);

    try {
        const q = query(collection(db, 'barbershops'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            notFound();
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data() as BarbershopData;

        // Check if site is published (bypass in Dev Mode)
        const isDev = process.env.NODE_ENV === 'development';
        if (data.isPublished === false && !isDev) {
            notFound();
        }

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
            <div className="bg-white min-h-screen relative">
                <PageViewTracker barbershopId={doc.id} />
                <GreetingFeature />

                <TemplateComponent data={data} />

                {/* Shop / Products Section */}
                <ShopSection barberId={doc.id} theme={templateId} />

                {data.faq && <FAQSection faq={data.faq} />}
                <ContactSection contact={data.content.contact} />

                {/* Floating Elements */}
                <CartDrawer />
                <CartFloatingButton />
            </div>
        );
    } catch (error) {
        console.error("Error fetching barbershop:", error);
        notFound();
    }
}
