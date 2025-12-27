'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Phone, Instagram, ArrowRight, Menu, X, ArrowUpRight, Scissors, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { BarbershopData } from '@/types/barbershop';
import BookingModal from '@/features/booking/components/BookingModal';
import EditableText from '@/components/ui/EditableText';
import ImageUploader from '@/components/ui/ImageUploader';
import ReviewsSection from '@/features/reviews/components/ReviewsSection';
import { useDemoStore } from '@/store/useDemoStore';
import { useTemplateEditor } from '@/features/templates/hooks/useTemplateEditor';
import { Toast } from '@/components/ui/Toast';
import BeforeAfterSlider from './BeforeAfterSlider';
import ProductsSection from './ProductsSection';

interface TemplateProps {
    data: BarbershopData;
    isEditing?: boolean;
    onUpdate?: (data: BarbershopData) => void;
}

export default function TemplateModern({ data, isEditing = false, onUpdate }: TemplateProps) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Smooth Scroll / Parallax
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const heroImageY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

    const { showBooking, showMap } = useDemoStore();
    const { content, services, gallery } = data;
    const { name, contact, colors } = content;

    const { updateContent, updateContact, updateService, updateGallery } = useTemplateEditor({
        data,
        onUpdate
    });

    const handleBookingClick = () => {
        if (isEditing) return;
        if (showBooking) {
            setIsBookingOpen(true);
        } else {
            const message = encodeURIComponent(`Olá, gostaria de agendar um horário na ${name}.`);
            window.open(`https://wa.me/${contact.whatsapp}?text=${message}`, '_blank');
        }
    };

    // Minimalist Palette: Light Gray items, deeply dark text.
    const cssVariables = {
        '--color-accent': colors.secondary || '#111111',
        '--color-bg': '#FAFAFA', // Always light for this theme
        '--color-text': '#111111',
        '--color-secondary-bg': '#F4F4F5',
    } as React.CSSProperties;

    return (
        <div ref={containerRef} style={cssVariables} className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans antialiased selection:bg-black selection:text-white">
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                barbershopId={data.id}
                services={services}
                themeColor={colors.secondary || '#111'}
            />

            <AnimatePresence>
                {toastMessage && (
                    <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
                )}
            </AnimatePresence>

            {/* HEADER / NAV - Minimalist Sticky */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-black/5"
            >
                <div className="max-w-[1800px] mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="text-xl font-bold tracking-tight uppercase flex items-center gap-2">
                        <Scissors size={18} />
                        <EditableText
                            as="span"
                            isEditing={isEditing}
                            value={name}
                            onChange={(val) => onUpdate && onUpdate({ ...data, name: val })}
                        />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide uppercase text-gray-500">
                        <a href="#services" className="hover:text-black transition-colors">Serviços</a>
                        <a href="#transformation" className="hover:text-black transition-colors">Transformação</a>
                        <a href="#gallery" className="hover:text-black transition-colors">Galeria</a>
                        <a href="#location" className="hover:text-black transition-colors">Local</a>
                    </div>

                    <div className="hidden md:block">
                        <button
                            onClick={handleBookingClick}
                            className="bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                        >
                            Agendar
                        </button>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-20 left-0 right-0 z-40 bg-[var(--color-bg)] border-b border-black/5 overflow-hidden md:hidden"
                    >
                        <div className="p-6 flex flex-col gap-6 text-center text-sm font-bold uppercase tracking-widest">
                            <a href="#services" onClick={() => setIsMenuOpen(false)}>Serviços</a>
                            <a href="#transformation" onClick={() => setIsMenuOpen(false)}>Transformação</a>
                            <a href="#gallery" onClick={() => setIsMenuOpen(false)}>Galeria</a>
                            <button onClick={handleBookingClick} className="bg-black text-white py-4 w-full mt-4">Agendar Agora</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HERO SECTION - Split Layout */}
            <header className="relative pt-20 min-h-screen flex flex-col md:flex-row">
                {/* Left: Content */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-24 relative z-10">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">Barbearia Premium</h2>

                            <div className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-[var(--color-text)]">
                                <span className="block">NOVO</span>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-br from-black to-gray-400">
                                    CONCEITO
                                </span>
                            </div>

                            <EditableText
                                as="p"
                                isEditing={isEditing}
                                value={content.description}
                                onChange={(val) => updateContent('description', val)}
                                className="text-lg md:text-xl text-gray-500 font-light leading-relaxed mb-10 max-w-md"
                            />

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleBookingClick}
                                    className="px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group"
                                >
                                    Agendar Agora
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <a
                                    href="#services"
                                    className="px-8 py-4 bg-gray-100 text-black text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center"
                                >
                                    Ver Serviços
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right: Image (Full height on Desktop, Aspect ratio on mobile) */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative bg-gray-100 overflow-hidden">
                    <motion.div
                        style={{ y: heroImageY }}
                        className="absolute inset-0 w-full h-[120%]" // slightly larger for parallax
                    >
                        <img
                            src={content.hero_image}
                            alt="Hero"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/5" />
                    </motion.div>

                    {isEditing && (
                        <div className="absolute top-6 right-6 z-20">
                            <ImageUploader onUpload={(url) => updateContent('hero_image', url)} />
                        </div>
                    )}
                </div>
            </header>

            {/* SERVICES SECTION - Minimal Grid */}
            <section id="services" className="py-24 px-6 md:px-24 bg-white">
                <div className="max-w-[1800px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row justify-between items-end mb-20 pb-4 border-b border-gray-100"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-text)]">
                            Menu de Serviços
                        </h2>
                        <p className="text-gray-400 mt-4 md:mt-0 font-light uppercase tracking-widest text-sm">
                            Experiência & Precisão
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                onClick={handleBookingClick}
                                className="group cursor-pointer"
                            >
                                <div className="flex justify-between items-baseline mb-3">
                                    <EditableText
                                        as="h3"
                                        isEditing={isEditing}
                                        value={service.name}
                                        onChange={(val) => updateService(index, 'name', val)}
                                        className="text-2xl font-medium group-hover:underline decoration-1 underline-offset-4"
                                    />
                                    <div className="text-xl font-bold">
                                        <span className="text-xs align-top mr-1">R$</span>
                                        <EditableText
                                            as="span"
                                            isEditing={isEditing}
                                            value={service.price.toString()}
                                            onChange={(val) => updateService(index, 'price', parseFloat(val) || 0)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-gray-400 text-sm">
                                    <EditableText
                                        as="span"
                                        isEditing={isEditing}
                                        value={service.duration}
                                        onChange={(val) => updateService(index, 'duration', val)}
                                    />
                                    <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRANSFORMATION SECTION - Clean Studio */}
            <section id="transformation" className="py-24 px-6 md:px-24 bg-[var(--color-secondary-bg)]">
                <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-5 order-2 md:order-1">
                        <div className="p-4 bg-white shadow-xl rounded-sm">
                            <BeforeAfterSlider
                                beforeImage="https://images.unsplash.com/photo-1599351431202-6e0000a28382?q=80&w=1000&auto=format&fit=crop"
                                afterImage="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1000&auto=format&fit=crop"
                                className="aspect-[4/5]"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-7 order-1 md:order-2 md:pl-12">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">Resultado Real</h2>
                        <h3 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
                            Mais que um corte, <br /> uma declaração.
                        </h3>
                        <p className="text-xl text-gray-500 font-light mb-8 max-w-lg leading-relaxed">
                            Acreditamos que a verdadeira elegância está nos detalhes. Confira a transformação que elevamos ao status de arte.
                        </p>
                    </div>
                </div>
            </section>

            {/* GALLERY SECTION - Editorial Grid */}
            <section id="gallery" className="py-24 px-6 md:px-24 bg-white">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-4xl font-bold tracking-tight mb-16"
                >
                    Editorial Visual
                </motion.h2>

                <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {gallery.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative group overflow-hidden bg-gray-100 aspect-[3/4] ${i === 0 ? 'md:col-span-2 md:row-span-2 aspect-[3/3.3]' : ''}`}
                        >
                            <img
                                src={img}
                                alt={`Gallery ${i}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {isEditing && (
                                <ImageUploader onUpload={(url) => updateGallery(i, url)} />
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* PRODUCTS SECTION (Optional) */}
            {content.showProductsSection && (
                <section className="bg-white">
                    <ProductsSection products={data.products || []} />
                </section>
            )}

            {/* REVIEWS SECTION */}
            <section className="bg-[var(--color-secondary-bg)] py-12">
                <ReviewsSection reviews={data.reviews || []} templateId="modern" />
            </section>

            {/* FOOTER */}
            {showMap && (
                <footer id="location" className="bg-black text-white pt-24 pb-12 px-6">
                    <div className="max-w-[1800px] mx-auto flex flex-col items-center text-center">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold tracking-tight mb-2">{name}</h2>
                            <p className="text-gray-500 text-sm tracking-widest uppercase">Barbearia Premium</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-12 md:gap-24 mb-24">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                    <MapPin size={20} />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Endereço</h3>
                                <EditableText
                                    as="span"
                                    isEditing={isEditing}
                                    value={contact.address}
                                    onChange={(val) => onUpdate && onUpdate({ ...data, contact: { ...contact, address: val } })}
                                    className="text-lg"
                                />
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                    <Phone size={20} />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Contato</h3>
                                <EditableText
                                    as="span"
                                    isEditing={isEditing}
                                    value={contact.phone}
                                    onChange={(val) => onUpdate && onUpdate({ ...data, contact: { ...contact, phone: val } })}
                                    className="text-lg"
                                />
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                    <Instagram size={20} />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Social</h3>
                                <div className="text-lg">
                                    @{contact.instagram || 'barbearia'}
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-gray-700 uppercase tracking-widest">
                            © {new Date().getFullYear()} {name}. Powered by BarberSaaS.
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}
