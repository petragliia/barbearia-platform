'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Calendar, Clock, MapPin, Phone, Instagram, ChevronRight, Star, X, Check, Save, Edit3, Upload, CheckCircle2 } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { clsx } from 'clsx';
import { BarbershopData } from '@/types/barbershop';
import BookingModal from '@/features/booking/components/BookingModal';
import EditableText from '@/components/ui/EditableText';
import ServiceCardGlass from '@/components/ui/ServiceCardGlass';
import ImageUploader from '@/components/ui/ImageUploader';
import ReviewsSection from '@/features/reviews/components/ReviewsSection';
import { useDemoStore } from '@/store/useDemoStore';
import { useTemplateEditor } from '@/features/templates/hooks/useTemplateEditor';

// Minimalist Toast Component
import { Toast } from '@/components/ui/Toast';



interface TemplateProps {
    data: BarbershopData;
    isEditing?: boolean;
    onUpdate?: (data: BarbershopData) => void;
}

export default function TemplateModern({ data, isEditing = false, onUpdate }: TemplateProps) {
    // Local State for UI only
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Feature Toggles from Demo Store
    const { showBooking, showMap, enablePremiumEffects } = useDemoStore();

    const { content, services, gallery } = data;

    // Animation Variants (Conditional based on enablePremiumEffects)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: enablePremiumEffects ? 0.1 : 0,
                delayChildren: enablePremiumEffects ? 0.2 : 0,
            },
        },
    };

    const itemVariants = {
        hidden: { y: enablePremiumEffects ? 20 : 0, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring' as const, stiffness: 50 },
        },
    };

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
        '--color-primary': content.colors.primary,     // Was implicit/black or styled
        '--color-secondary': content.colors.secondary, // Was implicit
        '--color-bg': content.colors.background || '#ffffff',
        '--color-text': content.colors.text || '#111827',
    } as React.CSSProperties;

    return (
        <div style={cssVariables} className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans selection:bg-black selection:text-white relative transition-colors duration-300">
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                barbershopId={data.id}
                services={services}
                themeColor={content.colors.secondary || '#000'}
            />

            <AnimatePresence>
                {toastMessage && (
                    <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
                )}
            </AnimatePresence>

            {/* Hero Section with Glassmorphism & Parallax */}
            <header className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-gray-100 group">
                <div className="absolute inset-0 z-0">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-bg)]/90 z-10" />
                    <motion.img
                        initial={enablePremiumEffects ? { scale: 1.1 } : { scale: 1 }}
                        animate={enablePremiumEffects ? { scale: 1 } : { scale: 1 }}
                        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                        src={content.hero_image}
                        alt="Hero"
                        className="w-full h-full object-cover opacity-80"
                    />
                    {isEditing && (
                        <ImageUploader onUpload={(url) => updateContent('hero_image', url)} />
                    )}
                </div>

                <div className="relative z-20 container mx-auto px-6 text-center">
                    <Tilt
                        tiltMaxAngleX={enablePremiumEffects ? 5 : 0}
                        tiltMaxAngleY={enablePremiumEffects ? 5 : 0}
                        glareEnable={enablePremiumEffects}
                        glareMaxOpacity={0.4}
                        glareColor="#ffffff"
                        glarePosition="all"
                        glareBorderRadius="24px"
                        className="inline-block"
                    >
                        <motion.div
                            initial={enablePremiumEffects ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="backdrop-blur-md bg-white/30 border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl inline-block max-w-3xl relative overflow-hidden"
                        >
                            {/* Holographic Shine Effect */}
                            {enablePremiumEffects && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            )}

                            <div className="mb-4">
                                <EditableText
                                    as="h1"
                                    isEditing={isEditing}
                                    value={content.name.toUpperCase()}
                                    onChange={(val) => updateContent('name', val)}
                                    className="text-5xl md:text-7xl font-black tracking-tighter text-[var(--color-text)]"
                                    style={{ color: content.colors.primary }} // Allow explicit primary color override for title
                                />
                            </div>

                            <div className="mb-8 max-w-xl mx-auto">
                                <EditableText
                                    as="p"
                                    isEditing={isEditing}
                                    value={content.description}
                                    onChange={(val) => updateContent('description', val)}
                                    className="text-xl md:text-2xl text-[var(--color-text)] font-light opacity-90"
                                />
                            </div>

                            <motion.button
                                whileHover={enablePremiumEffects ? { scale: 1.05 } : {}}
                                whileTap={enablePremiumEffects ? { scale: 0.95 } : {}}
                                onClick={handleBookingClick}
                                disabled={isEditing}
                                className={clsx(
                                    "px-10 py-4 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto relative z-10",
                                    isEditing && "opacity-50 cursor-not-allowed"
                                )}
                                style={{ backgroundColor: content.colors.secondary || '#000' }}
                            >
                                {showBooking ? <Calendar size={20} /> : <Phone size={20} />}
                                {showBooking ? 'AGENDAR HORÁRIO' : 'AGENDAR NO WHATSAPP'}
                            </motion.button>
                        </motion.div>
                    </Tilt>
                </div>
            </header>

            {/* Services Section with 3D Tilt Cards */}
            <section className="py-24 px-6 bg-[var(--color-bg)]">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={enablePremiumEffects ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4 tracking-tight">Nossos Serviços</h2>
                        <div className="w-20 h-1 bg-[var(--color-secondary)] mx-auto rounded-full" />
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {services.map((service, index) => (
                            <motion.div key={index} variants={itemVariants} className="h-full">
                                <ServiceCardGlass
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
                    </motion.div>
                </div>
            </section>

            {/* Gallery Section - Masonry Style */}
            <section className="py-24 bg-black text-white overflow-hidden" style={{ backgroundColor: content.colors.secondary || '#000' }}>
                <div className="container mx-auto px-6">
                    <motion.h2
                        initial={enablePremiumEffects ? { opacity: 0, x: -50 } : { opacity: 1, x: 0 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black mb-16 text-center md:text-left"
                    >
                        GALERIA
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                        {gallery.map((img, i) => (
                            <motion.div
                                key={i}
                                initial={enablePremiumEffects ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative rounded-2xl overflow-hidden group ${i === 0 ? 'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto' : 'aspect-square'}`}
                            >
                                <motion.img
                                    whileHover={enablePremiumEffects ? { scale: 1.1 } : {}}
                                    transition={{ duration: 0.6 }}
                                    src={img}
                                    alt={`Gallery ${i}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors duration-500" />
                                {isEditing && (
                                    <ImageUploader onUpload={(url) => updateGallery(i, url)} />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <ReviewsSection reviews={data.reviews || []} templateId="modern" />

            {/* Info & Footer */}
            {showMap && (
                <footer className="bg-[var(--color-bg)] py-24 px-6 border-t border-[var(--color-text)]/10">
                    <div className="container mx-auto max-w-4xl text-center">
                        <motion.div
                            initial={enablePremiumEffects ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid md:grid-cols-3 gap-12 mb-16"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                    <Phone size={24} style={{ color: content.colors.secondary }} />
                                </div>
                                <EditableText
                                    as="p"
                                    isEditing={isEditing}
                                    value={content.contact.phone}
                                    onChange={(val) => updateContact('phone', val)}
                                    className="font-medium text-lg"
                                />
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                    <MapPin size={24} style={{ color: content.colors.secondary }} />
                                </div>
                                <EditableText
                                    as="p"
                                    isEditing={isEditing}
                                    value={content.contact.address}
                                    onChange={(val) => updateContact('address', val)}
                                    className="font-medium text-lg max-w-[200px]"
                                />
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                    <Instagram size={24} style={{ color: content.colors.secondary }} />
                                </div>
                                <p className="font-medium text-lg flex items-center gap-1">
                                    @
                                    <EditableText
                                        as="span"
                                        isEditing={isEditing}
                                        value={content.contact.instagram ?? content.name.replace(/\s+/g, '').toLowerCase()}
                                        onChange={(val) => updateContact('instagram', val)}
                                        placeholder="barbearia"
                                    />
                                </p>
                            </div>
                        </motion.div>

                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} {content.name}. Powered by Barbershop SaaS.
                        </p>
                    </div>
                </footer>
            )}
        </div>
    );
}
