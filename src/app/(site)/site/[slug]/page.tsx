import { notFound } from 'next/navigation';
import { getBarbershopBySlug } from '@/features/barbershops/services/serverBarbershopService';
import TemplateClassic from '@/features/templates/components/TemplateClassic';
import TemplateModern from '@/features/templates/components/TemplateModern';
import TemplateUrban from '@/features/templates/components/TemplateUrban';
import { BarbershopData } from '@/types/barbershop';
import FAQSection from '@/features/marketing/components/FAQSection';
import ContactSection from '@/features/marketing/components/ContactSection';
import GreetingFeature from '@/features/onboarding/components/GreetingFeature';
import PageViewTracker from '@/features/analytics/components/PageViewTracker';
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
        const data = await getBarbershopBySlug(slug);

        if (!data) {
            notFound();
        }

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
                {/* <PageViewTracker barbershopId={data.id || data.ownerId} /> */}
                <GreetingFeature />

                <TemplateComponent data={data} />

                {/* Shop / Products Section */}
                <ShopSection barberId={data.ownerId} theme={templateId} />

                {data.faq && <FAQSection faq={data.faq} />}
                <ContactSection contact={data.contact} />

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
