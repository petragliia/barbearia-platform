'use client';

import Image from 'next/image';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { BarbershopData } from '@/types/barbershop';
import BookingModal from '@/features/booking/components/BookingModal';
import EditableText from '@/components/ui/EditableText';
import ImageUploader from '@/components/ui/ImageUploader';
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

const PrimaryButton = ({ children, onClick, className, disabled }: { children: React.ReactNode, onClick: () => void, className?: string, disabled?: boolean }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={clsx(
            "bg-[var(--color-primary)] text-black font-black uppercase tracking-wider py-4 px-8 hover:bg-white transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]",
            className
        )}
    >
        {children}
    </button>
);

const OutlinedButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
    <button
        onClick={onClick}
        className="border border-white/20 text-white font-bold uppercase tracking-wider py-4 px-8 hover:bg-white hover:text-black transition-all duration-300"
    >
        {children}
    </button>
);

export default function TemplateUrban({ data, isEditing = false, onUpdate }: TemplateProps) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const { showBooking, showMap } = useDemoStore();
    const { services, gallery } = data;
    // Handle root vs content legacy structure and defaults
    const content = data.content || {};
    const legacyContent = content as Record<string, any>;
    const name = data.name || legacyContent.name || "Minha Barbearia";
    const contact = data.contact || legacyContent.contact || { phone: "", whatsapp: "", address: "", instagram: "" };
    const colors = data.colors || legacyContent.colors || {
        primary: '#ef4444',
        secondary: '#1f2937',
        background: '#ffffff',
        text: '#000000'
    };

    const { updateContent, updateService } = useTemplateEditor({
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

    // CSS Variables Injection
    const cssVariables = {
        '--color-primary': colors.primary,
        '--color-secondary': colors.secondary,
        '--color-bg': colors.background || '#1a1a1a', // Fallback for existing data
        '--color-text': colors.text || '#ffffff',       // Fallback
    } as React.CSSProperties;

    // --- SUBCOMPONENTS FOR CLEANER CODE ---


    return (
        <div style={cssVariables} className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-mono selection:bg-[var(--color-primary)] selection:text-black overflow-x-hidden relative transition-colors duration-300">
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                barbershopId={data.id}
                services={services}
                themeColor="#00F0FF"
            />

            <AnimatePresence>
                {toastMessage && (
                    <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
                )}
            </AnimatePresence>

            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Logo Placeholder */}
                        <div className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
                            <span className="text-[#00F0FF] text-4xl">⚡</span>
                            <EditableText
                                as="span"
                                isEditing={isEditing}
                                value={name}
                                onChange={(val) => onUpdate && onUpdate({ ...data, name: val })}
                            />
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest text-gray-400">
                        <a href="#about" className="hover:text-white transition-colors">SOBRE</a>
                        <a href="#services" className="hover:text-white transition-colors">SERVIÇOS</a>
                        <a href="#location" className="hover:text-white transition-colors">LOCAL</a>
                    </div>

                    <div className="hidden md:block">
                        <PrimaryButton onClick={handleBookingClick} className="!py-2 !px-6 text-sm" disabled={isEditing}>
                            Agendar
                        </PrimaryButton>
                    </div>

                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-black/95 border-b border-white/10 overflow-hidden"
                        >
                            <div className="flex flex-col p-6 gap-6 text-center">
                                <a
                                    href="#about"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-xl font-bold text-gray-400 hover:text-white tracking-widest uppercase py-2"
                                >
                                    Sobre
                                </a>
                                <a
                                    href="#services"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-xl font-bold text-gray-400 hover:text-white tracking-widest uppercase py-2"
                                >
                                    Serviços
                                </a>
                                <a
                                    href="#location"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-xl font-bold text-gray-400 hover:text-white tracking-widest uppercase py-2"
                                >
                                    Local
                                </a>
                                <PrimaryButton onClick={() => { handleBookingClick(); setIsMobileMenuOpen(false); }} className="w-full" disabled={isEditing}>
                                    Agendar Agora
                                </PrimaryButton>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero Section */}
            <header className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                import Image from 'next/image';

                // ... (Handling import via separate call again or multi-replace)

                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={content.hero_image || '/placeholder-hero.jpg'}
                        alt="Hero"
                        fill
                        priority
                        className="object-cover opacity-60 grayscale md:grayscale-0"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="pt-10 md:pt-0"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px w-12 bg-[#00F0FF]"></div>
                            <span className="text-[#00F0FF] font-bold tracking-[0.2em] text-sm uppercase">Desde 2024</span>
                        </div>

                        <h1 className="text-5xl md:text-9xl font-black leading-[0.9] md:leading-[0.85] uppercase tracking-tighter mb-8">
                            <span className="block text-white">Estilo</span>
                            <span className="block text-white">Que</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-white" style={{ WebkitTextStroke: '1px #00F0FF', textShadow: '0 0 30px rgba(0,240,255,0.5)' }}>
                                Eletriza
                            </span>
                        </h1>

                        <div className="border-l-2 border-[#00F0FF] pl-6 mb-12 max-w-lg">
                            <EditableText
                                as="p"
                                isEditing={isEditing}
                                value={content.description}
                                onChange={(val) => updateContent('description', val)}
                                className="text-lg md:text-xl text-gray-300 font-light leading-relaxed"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <PrimaryButton onClick={handleBookingClick} className="w-full md:w-auto text-center" disabled={isEditing}>
                                Agendar Horário
                            </PrimaryButton>
                            <OutlinedButton onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                                Nossos Serviços
                            </OutlinedButton>
                        </div>
                    </motion.div>
                </div>
                {isEditing && (
                    <div className="absolute top-24 right-6 z-50 bg-black p-2 rounded">
                        <span className="text-xs text-gray-500 mb-1 block">Alterar Hero Image</span>
                        <ImageUploader onUpload={(url) => updateContent('hero_image', url)} />
                    </div>
                )}
            </header>

            {/* Services Section */}
            <section id="services" className="py-20 md:py-32 bg-[var(--color-bg)] relative">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20 gap-8">
                        <div>
                            <h2 className="text-5xl md:text-8xl font-black uppercase text-[var(--color-text)] leading-none">
                                <EditableText
                                    as="span"
                                    isEditing={isEditing}
                                    value={content.services_title?.split(' ')[0] || "Nossos"}
                                    onChange={(val) => {
                                        // Simple split handling or just full update? 
                                        // To keep complex layout, we might need separate fields or just accept simple text.
                                        // Let's Simplify: Just make it fully editable as one block if possible or split.
                                        // User wants "Nossos" and "Serviços". Let's assume title is "Nossos Serviços" and we split by space for styling?
                                        // Or better, let's use `services_title` for the first part and `services_subtitle` for the colored part?
                                        // In Classic: title="Nossos Serviços", subtitle="Experiência..."
                                        // Here: "Nossos" (white) "Serviços" (colored).
                                        // Let's use `services_title` for "Nossos" and `services_subtitle` for "Serviços" for this template specifically, 
                                        // or just add `services_title_highlight`?
                                        // Let's blindly use `services_title` for the whole thing and let them edit it as one string?
                                        // No, the design splits them.
                                        // Let's use `services_title` for the top part and `services_subtitle` for the highlighted part.
                                        updateContent('services_title', val);
                                    }}
                                    className="block"
                                />
                                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-secondary)]" style={{ textShadow: '0 0 20px rgba(255,94,0,0.3)' }}>
                                    <EditableText
                                        as="span"
                                        isEditing={isEditing}
                                        value={content.services_subtitle || "Serviços"}
                                        onChange={(val) => updateContent('services_subtitle', val)}
                                    />
                                </span>
                            </h2>
                        </div>
                        <div className="max-w-md text-gray-400 mb-4">
                            <EditableText
                                as="p"
                                isEditing={isEditing}
                                value={content.services_description || "Experiência completa de barbearia com produtos premium, toalha quente e atendimento de alta performance."}
                                onChange={(val) => updateContent('services_description', val)}
                                multiline
                            />
                        </div>
                        <a href="#" className="hidden md:block text-[var(--color-primary)] border-b border-[var(--color-primary)] pb-1 hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition-colors uppercase text-sm font-bold tracking-widest">
                            <EditableText
                                as="span"
                                isEditing={isEditing}
                                value={content.cta_text || "Ver Menu Completo"}
                                onChange={(val) => updateContent('cta_text', val)}
                            />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.slice(0, 3).map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="group relative h-[400px] md:h-[500px] overflow-hidden bg-[#111] border border-[var(--color-text)]/10"
                            >
                                {/* We can use a placeholder or specific image for each service type if available, otherwise reuse gallery or hero */}
                                <div className="absolute inset-0">
                                    <img
                                        src={gallery[index % gallery.length] || content.hero_image}
                                        alt={service.name}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                </div>

                                <div className="absolute bottom-0 left-0 w-full p-8">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex justify-between items-end gap-4">
                                            <EditableText
                                                as="h3"
                                                isEditing={isEditing}
                                                value={service.name}
                                                onChange={(val) => updateService(index, 'name', val)}
                                                className="text-2xl md:text-3xl font-black uppercase text-[var(--color-text)] mb-1 leading-tight break-words max-w-[70%]"
                                            />
                                            <div className="flex items-baseline gap-1 flex-shrink-0">
                                                <span className="text-sm md:text-base font-bold text-[var(--color-primary)]">R$</span>
                                                <EditableText
                                                    as="span"
                                                    isEditing={isEditing}
                                                    value={service.price.toString()}
                                                    onChange={(val) => updateService(index, 'price', parseFloat(val) || 0)}
                                                    className="text-2xl md:text-3xl font-black text-[var(--color-text)] leading-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About / USP Section */}
            <section id="about" className="py-20 md:py-32 bg-black text-[var(--color-text)] relative flex items-center">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-8 md:mb-12">
                            <EditableText
                                as="span"
                                isEditing={isEditing}
                                value={content.about_title_top || "Não"}
                                onChange={(val) => updateContent('about_title_top', val)}
                                className="block"
                            />
                            <EditableText
                                as="span"
                                isEditing={isEditing}
                                value={content.about_title_middle || "Aceitamos"}
                                onChange={(val) => updateContent('about_title_middle', val)}
                                className="block"
                            />
                            <span className="text-[var(--color-primary)]">
                                <EditableText
                                    as="span"
                                    isEditing={isEditing}
                                    value={content.about_title_bottom || "O Básico."}
                                    onChange={(val) => updateContent('about_title_bottom', val)}
                                />
                            </span>
                        </h2>

                        <div className="space-y-8 text-lg text-gray-400">
                            <div className="leading-relaxed">
                                <EditableText
                                    as="p"
                                    isEditing={isEditing}
                                    value={content.about_description || `Na ${name}, entendemos que o seu estilo é a sua assinatura. Nossos barbeiros são artistas treinados nas técnicas mais modernas de visagismo e corte.`}
                                    onChange={(val) => updateContent('about_description', val)}
                                    multiline
                                />
                            </div>

                            <ul className="space-y-6 mt-8">
                                <ul className="space-y-6 mt-8">
                                    {(content.features || [
                                        "Ambiente Climatizado e Som de Alta Qualidade",
                                        "Cerveja Gelada por Conta da Casa",
                                        "Estacionamento Exclusivo",
                                        "Agendamento Online Sem Fila"
                                    ]).map((item, i) => (
                                        <li key={i} className="flex items-center gap-4 group/item relative">
                                            <div className="w-2 h-2 rounded-full bg-[var(--color-secondary)] flex-shrink-0"></div>
                                            <EditableText
                                                as="span"
                                                isEditing={isEditing}
                                                value={item}
                                                onChange={(val) => {
                                                    const newFeatures = [...(content.features || [
                                                        "Ambiente Climatizado e Som de Alta Qualidade",
                                                        "Cerveja Gelada por Conta da Casa",
                                                        "Estacionamento Exclusivo",
                                                        "Agendamento Online Sem Fila"
                                                    ])];
                                                    newFeatures[i] = val;
                                                    updateContent('features', newFeatures);
                                                }}
                                                className="font-bold text-[var(--color-text)] tracking-wide text-xs md:text-base uppercase w-full"
                                            />
                                            {isEditing && (
                                                <button
                                                    onClick={() => {
                                                        const newFeatures = [...(content.features || [
                                                            "Ambiente Climatizado e Som de Alta Qualidade",
                                                            "Cerveja Gelada por Conta da Casa",
                                                            "Estacionamento Exclusivo",
                                                            "Agendamento Online Sem Fila"
                                                        ])];
                                                        newFeatures.splice(i, 1);
                                                        updateContent('features', newFeatures);
                                                    }}
                                                    className="opacity-0 group-hover/item:opacity-100 text-red-500 hover:text-red-400 p-1"
                                                    title="Remover item"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                    {isEditing && (
                                        <li className="pt-2">
                                            <button
                                                onClick={() => {
                                                    const currentFeatures = content.features || [
                                                        "Ambiente Climatizado e Som de Alta Qualidade",
                                                        "Cerveja Gelada por Conta da Casa",
                                                        "Estacionamento Exclusivo",
                                                        "Agendamento Online Sem Fila"
                                                    ];
                                                    updateContent('features', [...currentFeatures, "Novo Item"]);
                                                }}
                                                className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1"
                                            >
                                                + Adicionar Item
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </ul>
                        </div>

                        <div className="mt-12 md:hidden">
                            <div className="w-16 h-16 border-l-4 border-b-4 border-[var(--color-secondary)]" />
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative aspect-square border border-[var(--color-text)]/10 bg-[#0a0a0a] p-12 flex items-center justify-center">
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-20 md:w-32 h-20 md:h-32 border-t-4 border-r-4 border-[var(--color-primary)]" />
                            <div className="absolute bottom-0 left-0 w-16 md:w-24 h-16 md:h-24 border-b-4 border-l-4 border-[var(--color-secondary)]" />

                            <Scissors size={80} className="text-[var(--color-text)]/20 md:w-[120px] md:h-[120px]" strokeWidth={1} />
                        </div>
                    </div>
                </div>
            </section>

            {/* PRODUCTS SECTION (Optional) */}
            {content.showProductsSection && (
                <section className="bg-black py-20 border-t border-white/5">
                    <ProductsSection products={data.products || []} />
                </section>
            )}

            {/* FAQ Section */}
            {data.faq && data.faq.length > 0 && (
                <FAQSection
                    faq={data.faq}
                    isEditing={isEditing}
                    onUpdate={(index, field, value) => {
                        const newFaq = [...(data.faq || [])];
                        newFaq[index] = { ...newFaq[index], [field]: value };
                        if (onUpdate) onUpdate({ ...data, faq: newFaq });
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
                    templateId="urban"
                />
            )}

            {/* Footer / Location */}
            {showMap && (
                <Footer
                    data={data}
                    isEditing={isEditing}
                    onUpdate={onUpdate}
                    templateId="urban"
                />
            )}
        </div>
    );
}
