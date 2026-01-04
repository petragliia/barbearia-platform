'use client';

import { BarbershopData } from '@/types/barbershop';
import { X } from 'lucide-react';
import { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import BookingModal from '@/features/booking/components/BookingModal';
import EditableText from '@/components/ui/EditableText';
import EditableImage from '@/components/ui/EditableImage';
import ImageUploader from '@/components/ui/ImageUploader';
import ServiceCardClassic from '@/features/marketing/components/ServiceCardClassic';
import SectionHeading from '@/components/ui/SectionHeading';
import FloatingCTA from '@/components/ui/FloatingCTA';
import ReviewsSection from '@/features/reviews/components/ReviewsSection';
import { useTemplateEditor } from '@/features/templates/hooks/useTemplateEditor';
import { useDemoStore } from '@/store/useDemoStore';
import { Toast } from '@/components/ui/Toast';
import ProductsSection from './ProductsSection';
import Footer from '@/features/marketing/components/Footer';
import FAQSection from '@/features/marketing/components/FAQSection';

interface TemplateProps {
    data: BarbershopData;
    isEditing?: boolean;
    onUpdate?: (data: BarbershopData) => void;
}

export default function TemplateClassic({ data, isEditing = false, onUpdate }: TemplateProps) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const { showBooking, showMap, enablePremiumEffects } = useDemoStore();

    // Robust data extraction
    const content = data.content || {};
    const services = data.services || [];
    const gallery = data.gallery || [];
    const name = data.name || "Minha Barbearia";
    const contact = data.contact || { phone: '', whatsapp: '', address: '', instagram: '' };

    const { updateContent, updateService, updateGallery } = useTemplateEditor({
        data,
        onUpdate
    });

    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
    const heroY = useTransform(scrollY, [0, 500], [0, 200], { clamp: false });

    const handleBookingClick = () => {
        if (isEditing) return;
        if (showBooking) {
            setIsBookingOpen(true);
        } else {
            const message = encodeURIComponent(`Olá, gostaria de agendar um horário na ${name}.`);
            window.open(`https://wa.me/${contact.whatsapp}?text=${message}`, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-classic-bg text-classic-cream font-serif selection:bg-classic-gold selection:text-black overflow-x-hidden">
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                barbershopId={data.id}
                services={services}
                themeColor="#D4AF37"
            />

            <AnimatePresence>
                {toastMessage && (
                    <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
                )}
            </AnimatePresence>

            {!isEditing && <FloatingCTA onClick={handleBookingClick} />}

            {/* HERO SECTION */}
            <header className="relative h-[90vh] md:h-screen overflow-hidden flex items-center justify-center">
                <motion.div
                    style={{ y: enablePremiumEffects ? heroY : 0, opacity: enablePremiumEffects ? heroOpacity : 1 }}
                    className="absolute inset-0 z-0 bg-black"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-classic-bg z-10" />
                    <img
                        src={content.hero_image}
                        alt="Hero"
                        className="w-full h-full object-cover object-center opacity-60"
                    />
                    {isEditing && (
                        <div className="absolute top-4 right-4 z-50">
                            <ImageUploader onUpload={(url) => updateContent('hero_image', url)} />
                        </div>
                    )}
                </motion.div>

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="mb-6 flex justify-center"
                    >
                        {/* Optional Logo Placeholder if exists, otherwise ornamental line */}
                        <div className="h-[2px] w-24 bg-classic-gold" />
                    </motion.div>

                    <EditableText
                        as="h1"
                        isEditing={isEditing}
                        value={name}
                        onChange={(val) => onUpdate && onUpdate({ ...data, name: val })}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-classic-gold mb-6 tracking-wide drop-shadow-lg"
                    />

                    <EditableText
                        as="p"
                        isEditing={isEditing}
                        value={content.description}
                        onChange={(val) => updateContent('description', val)}
                        className="text-base sm:text-lg md:text-2xl text-white/90 font-sans font-light tracking-[0.2em] uppercase mb-12"
                    />


                    <motion.div
                        role="button"
                        tabIndex={0}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleBookingClick}
                        className="
                            bg-transparent border border-classic-gold text-classic-gold cursor-pointer
                            px-8 py-3 md:px-10 md:py-3 text-xs md:text-sm md:text-base font-bold uppercase tracking-[0.25em] relative overflow-hidden group
                            hover:text-black transition-colors duration-500 w-full sm:w-auto
                        "
                    >
                        <span className="relative z-10 block min-w-[120px]">
                            <EditableText
                                as="span"
                                isEditing={isEditing}
                                value={content.cta_text || "Agendar Agora"}
                                onChange={(val) => updateContent('cta_text', val)}
                                className="text-inherit whitespace-nowrap block w-full text-center cursor-text"
                            />
                        </span>
                        <div className="absolute inset-0 bg-classic-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left -z-0"></div>
                    </motion.div>
                </div>
            </header>

            {/* SERVICES SECTION */}
            <section className="py-24 px-6 md:px-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: `repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)`, backgroundSize: '20px 20px' }}
                />

                <div className="container mx-auto max-w-4xl relative z-10">
                    <SectionHeading
                        title={content.services_title || "Nossos Serviços"}
                        subtitle={content.services_subtitle || "Experiência & Tradição"}
                        isEditing={isEditing}
                        onTitleChange={(val) => updateContent('services_title', val)}
                        onSubtitleChange={(val) => updateContent('services_subtitle', val)}
                    />

                    <div className="grid grid-cols-1 gap-6">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={enablePremiumEffects ? { opacity: 0, y: 20 } : { opacity: 1 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ServiceCardClassic
                                    onClick={handleBookingClick}
                                    serviceName={
                                        <EditableText
                                            as="span"
                                            isEditing={isEditing}
                                            value={service.name}
                                            onChange={(val) => updateService(index, 'name', val)}
                                        />
                                    }
                                    duration={
                                        <EditableText
                                            as="span"
                                            isEditing={isEditing}
                                            value={service.duration}
                                            onChange={(val) => updateService(index, 'duration', val)}
                                        />
                                    }
                                    price={
                                        <EditableText
                                            as="span"
                                            isEditing={isEditing}
                                            value={service.price.toString()}
                                            onChange={(val) => updateService(index, 'price', parseFloat(val) || 0)}
                                        />
                                    }
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GALLERY SECTION */}
            <section className="py-24 bg-[#080505]">
                <div className="container mx-auto px-6">
                    <SectionHeading
                        title={content.gallery_title || "O Ambiente"}
                        subtitle={content.gallery_subtitle || "Nossa Casa"}
                        isEditing={isEditing}
                        onTitleChange={(val) => updateContent('gallery_title', val)}
                        onSubtitleChange={(val) => updateContent('gallery_subtitle', val)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[250px]">
                        {gallery.map((img, i) => (
                            <motion.div
                                key={i}
                                initial={enablePremiumEffects ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative group cursor-pointer overflow-hidden rounded-lg ${gallery.length === 1 ? 'aspect-[16/9]' :
                                    gallery.length === 3 && i === 0 ? 'md:col-span-2 md:row-span-2 aspect-[4/3]' :
                                        'aspect-square'
                                    }`}
                            >
                                <div className="absolute inset-0 border border-[var(--color-primary)] opacity-30 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500 pointer-events-none"></div>
                                <div className="relative w-full h-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                    <EditableImage
                                        src={img}
                                        alt={`Gallery ${i}`}
                                        isEditing={isEditing}
                                        onUpload={(url) => updateGallery(i, url)}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        containerClassName="w-full h-full"
                                    />
                                    {isEditing && (
                                        <div className="absolute top-2 right-2 z-20">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!onUpdate) return;
                                                    const newGallery = gallery.filter((_, index) => index !== i);
                                                    onUpdate({ ...data, gallery: newGallery });
                                                }}
                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {isEditing && gallery.length < 6 && (
                            <div className="flex items-center justify-center border border-dashed border-classic-gold/30 bg-classic-gold/5">
                                <ImageUploader
                                    onUpload={(url) => {
                                        if (!onUpdate) return;
                                        onUpdate({ ...data, gallery: [...gallery, url] });
                                    }}
                                    label="Adicionar Foto"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* PRODUCTS SECTION (Optional) */}
            {content.showProductsSection && (
                <section className="bg-classic-bg border-t border-classic-gold/10">
                    <ProductsSection products={data.products || []} />
                </section>
            )}

            {/* REVIEWS SECTION */}
            <div className="border-t border-classic-gold/10 bg-classic-bg">
                <ReviewsSection reviews={data.reviews || []} templateId="classic" />
            </div>

            {/* FOOTER */}
            {/* FOOTER */}
            {data.faq && data.faq.length > 0 && (
                <FAQSection
                    faq={data.faq}
                    isEditing={isEditing}
                    onUpdate={(index, field, value) => {
                        const newFaq = [...(data.faq || [])];
                        newFaq[index] = { ...newFaq[index], [field]: value };
                        // We need a wrapper to call onUpdate with full data
                        if (onUpdate) {
                            onUpdate({ ...data, faq: newFaq });
                        }
                    }}
                    onAdd={() => {
                        const newFaq = [...(data.faq || []), { question: "Nova Pergunta", answer: "Nova Resposta" }];
                        if (onUpdate) onUpdate({ ...data, faq: newFaq });
                    }}
                    onRemove={(index) => {
                        const newFaq = [...(data.faq || [])];
                        newFaq.splice(index, 1);
                        if (onUpdate) onUpdate({ ...data, faq: newFaq });
                    }}
                    templateId="classic"
                />
            )}

            {showMap && (
                <Footer
                    data={data}
                    isEditing={isEditing}
                    onUpdate={onUpdate}
                    templateId="classic"
                />
            )}
        </div>
    );
}
