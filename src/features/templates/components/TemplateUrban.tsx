'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Instagram, ArrowRight, Scissors, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { BarbershopData } from '@/types/barbershop';
import BookingModal from '@/features/booking/components/BookingModal';
import EditableText from '@/components/ui/EditableText';
import ImageUploader from '@/components/ui/ImageUploader';
import ReviewsSection from '@/features/reviews/components/ReviewsSection';
import { useTemplateEditor } from '@/features/templates/hooks/useTemplateEditor';
import { useDemoStore } from '@/store/useDemoStore';
import { Toast } from '@/components/ui/Toast';

interface TemplateProps {
    data: BarbershopData;
    isEditing?: boolean;
    onUpdate?: (data: BarbershopData) => void;
}

export default function TemplateUrban({ data, isEditing = false, onUpdate }: TemplateProps) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const { showBooking, showMap, enablePremiumEffects } = useDemoStore();
    const { content, services, gallery } = data;

    const { updateContent, updateContact, updateService, updateGallery } = useTemplateEditor({
        data,
        onUpdate
    });

    const handleBookingClick = () => {
        if (isEditing) return;
        if (showBooking) {
            setIsBookingOpen(true);
        } else {
            const message = encodeURIComponent(`Olá, gostaria de agendar um horário na ${content.name}.`);
            window.open(`https://wa.me/${content.contact.whatsapp}?text=${message}`, '_blank');
        }
    };

    // CSS Variables Injection
    const cssVariables = {
        '--color-primary': content.colors.primary,
        '--color-secondary': content.colors.secondary,
        '--color-bg': content.colors.background || '#1a1a1a', // Fallback for existing data
        '--color-text': content.colors.text || '#ffffff',       // Fallback
    } as React.CSSProperties;

    // --- SUBCOMPONENTS FOR CLEANER CODE ---

    const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
        <div className="mb-12">
            <h3 className="text-[var(--color-primary)] font-bold tracking-widest text-sm mb-2 uppercase">{subtitle}</h3>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-text)] uppercase tracking-tighter">{title}</h2>
        </div>
    );

    const PrimaryButton = ({ children, onClick, className }: { children: React.ReactNode, onClick: () => void, className?: string }) => (
        <button
            onClick={onClick}
            disabled={isEditing}
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
                                value={content.name}
                                onChange={(val) => updateContent('name', val)}
                            />
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest text-gray-400">
                        <a href="#about" className="hover:text-white transition-colors">SOBRE</a>
                        <a href="#services" className="hover:text-white transition-colors">SERVIÇOS</a>
                        <a href="#location" className="hover:text-white transition-colors">LOCAL</a>
                    </div>

                    <PrimaryButton onClick={handleBookingClick} className="!py-2 !px-6 text-sm">
                        Agendar
                    </PrimaryButton>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={content.hero_image}
                        alt="Hero"
                        className="w-full h-full object-cover opacity-60 grayscale md:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px w-12 bg-[#00F0FF]"></div>
                            <span className="text-[#00F0FF] font-bold tracking-[0.2em] text-sm uppercase">Desde 2024</span>
                        </div>

                        <h1 className="text-7xl md:text-9xl font-black leading-[0.85] uppercase tracking-tighter mb-8">
                            <span className="block text-white">Estilo</span>
                            <span className="block text-white">Que</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-white" style={{ WebkitTextStroke: '2px #00F0FF', textShadow: '0 0 30px rgba(0,240,255,0.5)' }}>
                                Eletriza
                            </span>
                        </h1>

                        <div className="border-l-2 border-[#00F0FF] pl-6 mb-12 max-w-lg">
                            <EditableText
                                as="p"
                                isEditing={isEditing}
                                value={content.description}
                                onChange={(val) => updateContent('description', val)}
                                className="text-xl text-gray-300 font-light leading-relaxed"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <PrimaryButton onClick={handleBookingClick} className="w-full md:w-auto text-center">
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
            <section id="services" className="py-32 bg-[var(--color-bg)] relative">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div>
                            <h2 className="text-6xl md:text-8xl font-black uppercase text-[var(--color-text)] leading-none">
                                Nossos<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-secondary)]" style={{ textShadow: '0 0 20px rgba(255,94,0,0.3)' }}>
                                    Serviços
                                </span>
                            </h2>
                        </div>
                        <div className="max-w-md text-gray-400 mb-4">
                            <p>Experiência completa de barbearia com produtos premium, toalha quente e atendimento de alta performance.</p>
                        </div>
                        <a href="#" className="hidden md:block text-[var(--color-primary)] border-b border-[var(--color-primary)] pb-1 hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition-colors uppercase text-sm font-bold tracking-widest">
                            Ver Menu Completo
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
                                className="group relative h-[500px] overflow-hidden bg-[#111] border border-[var(--color-text)]/10"
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
                                        <div className="flex justify-between items-end">
                                            <EditableText
                                                as="h3"
                                                isEditing={isEditing}
                                                value={service.name}
                                                onChange={(val) => updateService(index, 'name', val)}
                                                className="text-4xl font-black uppercase text-[var(--color-text)] mb-2 leading-none"
                                            />
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-[var(--color-primary)] block mb-1">R$</span>
                                                <EditableText
                                                    as="span"
                                                    isEditing={isEditing}
                                                    value={service.price.toString()}
                                                    onChange={(val) => updateService(index, 'price', parseFloat(val) || 0)}
                                                    className="text-4xl font-black text-[var(--color-text)] leading-none"
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
            <section id="about" className="py-32 bg-black text-[var(--color-text)] relative flex items-center">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-6xl md:text-7xl font-black uppercase leading-[0.9] mb-12">
                            Não<br />Aceitamos<br />
                            <span className="text-[var(--color-primary)]">O Básico.</span>
                        </h2>

                        <div className="space-y-8 text-lg text-gray-400">
                            <p className="leading-relaxed">
                                Na {content.name}, entendemos que o seu estilo é a sua assinatura.
                                Nossos barbeiros são artistas treinados nas técnicas mais modernas de visagismo e corte.
                            </p>

                            <ul className="space-y-6 mt-8">
                                {[
                                    "Ambiente Climatizado e Som de Alta Qualidade",
                                    "Cerveja Gelada por Conta da Casa",
                                    "Estacionamento Exclusivo",
                                    "Agendamento Online Sem Fila"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-[var(--color-secondary)]"></div>
                                        <span className="font-bold text-[var(--color-text)] tracking-wide text-sm md:text-base uppercase">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-12 md:hidden">
                            <div className="w-16 h-16 border-l-4 border-b-4 border-[var(--color-secondary)]" />
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative aspect-square border border-[var(--color-text)]/10 bg-[#0a0a0a] p-12 flex items-center justify-center">
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-[var(--color-primary)]" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-[var(--color-secondary)]" />

                            <Scissors size={120} className="text-[var(--color-text)]/20" strokeWidth={1} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer / Location */}
            {showMap && (
                <footer id="location" className="bg-[#080808] border-t border-[var(--color-text)]/5 pt-24 pb-12 px-6">
                    <div className="container mx-auto">
                        <div className="grid md:grid-cols-2 gap-16 mb-24">
                            <div>
                                <h2 className="text-4xl font-black text-[var(--color-text)] uppercase mb-8">
                                    <span className="text-[var(--color-primary)]">⚡</span> {content.name}
                                </h2>
                                <p className="text-gray-400 max-w-sm mb-12">
                                    O ponto de encontro para quem busca excelência, estilo e uma experiência única.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <MapPin className="text-[var(--color-primary)]" />
                                        <EditableText
                                            as="span"
                                            isEditing={isEditing}
                                            value={content.contact.address}
                                            onChange={(val) => updateContact('address', val)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <Phone className="text-[var(--color-primary)]" />
                                        <EditableText
                                            as="span"
                                            isEditing={isEditing}
                                            value={content.contact.phone}
                                            onChange={(val) => updateContact('phone', val)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <Instagram className="text-[var(--color-primary)]" />
                                        <div className="flex">
                                            <span>@</span>
                                            <EditableText
                                                as="span"
                                                isEditing={isEditing}
                                                value={content.contact.instagram ?? "barbearia"}
                                                onChange={(val) => updateContact('instagram', val)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center md:justify-end">
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-[var(--color-text)] mb-6 uppercase">Pronto para Mudar?</h3>
                                    <PrimaryButton onClick={handleBookingClick} className="w-full md:w-auto">
                                        Agendar Agora
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-8 text-center text-gray-600 text-sm">
                            <p>&copy; {new Date().getFullYear()} {content.name}. Todos os direitos reservados.</p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}
