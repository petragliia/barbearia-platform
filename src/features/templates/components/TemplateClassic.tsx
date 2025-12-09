'use client';

import { BarbershopData } from '@/types/barbershop';
import { MapPin, Phone, Clock, Instagram, Calendar, Star, Edit3, Save, X, Upload, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import BookingModal from '@/features/booking/components/BookingModal';
import { clsx } from 'clsx';
import HeroSectionParallax from '@/components/ui/HeroSectionParallax';
import EditableText from '@/components/ui/EditableText';
import ImageUploader from '@/components/ui/ImageUploader';
import ServiceCardClassic from '@/components/ui/ServiceCardClassic';
import ReviewsSection from '@/features/reviews/components/ReviewsSection';
import { useTemplateEditor } from '@/features/templates/hooks/useTemplateEditor';
import FAQSection from '@/components/ui/FAQSection';
import ContactSection from '@/components/ui/ContactSection';
import { useDemoStore } from '@/store/useDemoStore';

// Minimalist Toast Component
import { Toast } from '@/components/ui/Toast';

interface TemplateProps {
    data: BarbershopData;
    isEditing?: boolean;
    onUpdate?: (data: BarbershopData) => void;
}

export default function TemplateClassic({ data, isEditing = false, onUpdate }: TemplateProps) {
    // Local State for UI only
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Feature Toggles from Demo Store
    const { showBooking, showMap, enablePremiumEffects } = useDemoStore();

    const { content, services, gallery } = data;
    const { scrollY } = useScroll();
    // Conditional Parallax
    const y1 = useTransform(scrollY, [0, 500], [0, enablePremiumEffects ? 200 : 0]);

    // Handlers
    const { updateContent, updateContact, updateService, updateGallery } = useTemplateEditor({
        data,
        onUpdate
    });

    const handleBookingClick = () => {
        if (isEditing) return;

        if (showBooking) {
            setIsBookingOpen(true);
        } else {
            // Open WhatsApp
            const message = encodeURIComponent(`Olá, gostaria de agendar um horário na ${content.name}.`);
            window.open(`https://wa.me/${content.contact.whatsapp}?text=${message}`, '_blank');
        }
    };

    // CSS Variables Injection
    const cssVariables = {
        '--color-primary': content.colors.primary,      // Default: #d4af37
        '--color-secondary': content.colors.secondary,
        '--color-bg': content.colors.background || '#0a0a0a',
        '--color-text': content.colors.text || '#d4af37', // Classic uses primary as main text color often, or a light variation
        '--color-text-dim': `${content.colors.primary}80`, // 50% opacity
    } as React.CSSProperties;

    return (
        <div style={cssVariables} className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-serif selection:bg-[var(--color-primary)] selection:text-black relative transition-colors duration-300">
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                barbershopId={data.id}
                services={services}
                themeColor={content.colors.primary}
            />

            <AnimatePresence>
                {toastMessage && (
                    <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
                )}
            </AnimatePresence>

            {/* Hero Section with Parallax */}
            <HeroSectionParallax
                name={content.name}
                description={content.description}
                heroImage={content.hero_image}
                isEditing={isEditing}
                onUpdate={(field, value) => updateContent(field as any, value)}
                onBooking={handleBookingClick}
                enableParallax={enablePremiumEffects}
            // Check if HeroSectionParallax supports styles or custom colors. 
            // If not, it might need updating or we assume it inherits text color. 
            // For now, let's assume inheritance or update it later if needed.
            />

            {/* Services Section */}
            <section className="py-24 px-6 bg-[var(--color-bg)] relative">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>
                <div className="container mx-auto max-w-5xl relative z-10">
                    <motion.div
                        initial={enablePremiumEffects ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-primary)]">Nossos Serviços</h2>
                        <div className="flex justify-center items-center gap-4">
                            <div className="h-[1px] w-20 bg-[var(--color-primary)] opacity-50"></div>
                            <div className="h-2 w-2 rounded-full bg-[var(--color-primary)]"></div>
                            <div className="h-[1px] w-20 bg-[var(--color-primary)] opacity-50"></div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={enablePremiumEffects ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
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

            {/* Gallery Section */}
            <section className="py-24 bg-[var(--color-bg)]">
                <div className="container mx-auto px-6">
                    <motion.h2
                        initial={enablePremiumEffects ? { opacity: 0 } : { opacity: 1 }}
                        whileInView={{ opacity: 1 }}
                        className="text-4xl font-bold mb-16 text-center text-[var(--color-primary)]"
                    >
                        AMBIENTE
                    </motion.h2>

                    <div className={`grid gap-4 ${gallery.length === 1 ? 'grid-cols-1' :
                        gallery.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                            gallery.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
                                'grid-cols-2 md:grid-cols-3'
                        }`}>
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
                                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                    {isEditing && (
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <ImageUploader onUpload={(url) => updateGallery(i, url)} />
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
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="aspect-square border-2 border-dashed border-[var(--color-primary)] opacity-80 rounded-lg flex flex-col items-center justify-center text-[var(--color-primary)] hover:opacity-100 transition-colors cursor-pointer bg-[var(--color-primary)]/5"
                            >
                                <ImageUploader
                                    onUpload={(url) => {
                                        if (!onUpdate) return;
                                        onUpdate({ ...data, gallery: [...gallery, url] });
                                    }}
                                    label="Adicionar Foto"
                                />
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <ReviewsSection reviews={data.reviews || []} templateId="classic" />

            {/* Footer */}
            {showMap && (
                <footer className="bg-[var(--color-bg)] py-20 px-6 border-t border-[var(--color-primary)]/20">
                    <div className="container mx-auto max-w-4xl text-center">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-2">{content.name}</h2>
                            <p className="text-[var(--color-primary)] opacity-50 text-sm uppercase tracking-widest">Desde 2024</p>
                        </div>

                        <div className="flex flex-col md:flex-row justify-center gap-12 mb-16 font-sans text-[var(--color-text)]">
                            <div className="flex items-center gap-3 justify-center">
                                <Phone size={20} className="text-[var(--color-primary)]" />
                                <EditableText
                                    as="span"
                                    isEditing={isEditing}
                                    value={content.contact.phone}
                                    onChange={(val) => updateContact('phone', val)}
                                />
                            </div>
                            <div className="flex items-center gap-3 justify-center">
                                <MapPin size={20} className="text-[var(--color-primary)]" />
                                <EditableText
                                    as="span"
                                    isEditing={isEditing}
                                    value={content.contact.address}
                                    onChange={(val) => updateContact('address', val)}
                                />
                            </div>
                            <div className="flex items-center gap-3 justify-center">
                                <Instagram size={20} className="text-[var(--color-primary)]" />
                                <span className="flex items-center">
                                    @
                                    <EditableText
                                        as="span"
                                        isEditing={isEditing}
                                        value={content.contact.instagram ?? content.name.replace(/\s+/g, '').toLowerCase()}
                                        onChange={(val) => updateContact('instagram', val)}
                                        placeholder="barbearia"
                                    />
                                </span>
                            </div>
                        </div>

                        <div className="w-24 h-[1px] bg-[var(--color-primary)] opacity-30 mx-auto mb-8"></div>

                        <p className="text-[var(--color-primary)] opacity-30 text-xs font-sans">
                            © {new Date().getFullYear()} {content.name}. All rights reserved.
                        </p>
                    </div>
                </footer>
            )}
        </div>
    );
}
