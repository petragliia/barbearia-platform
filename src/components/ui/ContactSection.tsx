'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageCircle, MessageSquare } from 'lucide-react';
import EditableText from '@/components/ui/EditableText';

interface ContactSectionProps {
    contact: {
        phone: string;
        address: string;
        instagram?: string;
        whatsapp: string;
        email?: string;
    };
    isEditing?: boolean;
    onUpdate?: (field: 'phone' | 'address' | 'instagram' | 'whatsapp' | 'email', value: string) => void;
}

export default function ContactSection({ contact, isEditing, onUpdate }: ContactSectionProps) {
    const handleWhatsAppClick = () => {
        if (isEditing) return;
        const message = encodeURIComponent("Olá, gostaria de tirar uma dúvida.");
        window.open(`https://wa.me/${contact.whatsapp}?text=${message}`, '_blank');
    };

    return (

        <section className="py-24 relative border-t border-[var(--color-primary)]/10" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="container mx-auto px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-primary)]">Fale Conosco</h2>
                    <p className="max-w-2xl mx-auto opacity-70 text-[var(--color-text)]">
                        Tem alguma dúvida ou precisa de mais informações? Entre em contato conosco através de um dos canais abaixo.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-[var(--color-bg)] bg-[var(--color-primary)]">
                                <Phone size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium opacity-60 text-[var(--color-text)]">Telefone</p>
                                <EditableText
                                    as="p"
                                    isEditing={!!isEditing}
                                    value={contact.phone}
                                    onChange={(val) => onUpdate?.('phone', val)}
                                    className="font-bold text-[var(--color-text)]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-[var(--color-bg)] bg-[var(--color-primary)]">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium opacity-60 text-[var(--color-text)]">Endereço</p>
                                <EditableText
                                    as="p"
                                    isEditing={!!isEditing}
                                    value={contact.address}
                                    onChange={(val) => onUpdate?.('address', val)}
                                    className="font-bold text-[var(--color-text)]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-[var(--color-bg)] bg-[var(--color-primary)]">
                                <Instagram size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium opacity-60 text-[var(--color-text)]">Instagram</p>
                                <div className="flex items-center font-bold text-[var(--color-text)]">
                                    @
                                    <EditableText
                                        as="span"
                                        isEditing={!!isEditing}
                                        value={contact.instagram || ''}
                                        onChange={(val) => onUpdate?.('instagram', val)}
                                        placeholder="seu_instagram"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-[var(--color-bg)] bg-[var(--color-primary)]">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium opacity-60 text-[var(--color-text)]">WhatsApp</p>
                                <EditableText
                                    as="p"
                                    isEditing={!!isEditing}
                                    value={contact.whatsapp}
                                    onChange={(val) => onUpdate?.('whatsapp', val)}
                                    className="font-bold text-[var(--color-text)]"
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-2xl border text-center border-[var(--color-primary)]/20 bg-[var(--color-text)]/5"
                    >
                        <MessageCircle size={48} className="mx-auto mb-6 text-[var(--color-primary)]" />
                        <h3 className="text-2xl font-bold mb-4 text-[var(--color-text)]">Dúvidas Rápidas?</h3>
                        <p className="mb-8 opacity-70 text-[var(--color-text)]">
                            Fale diretamente conosco pelo WhatsApp. Respondemos o mais rápido possível.
                        </p>
                        <button
                            onClick={handleWhatsAppClick}
                            disabled={isEditing}
                            className={`
                                w-full py-4 font-bold rounded-lg transition-colors flex items-center justify-center gap-2
                                text-[var(--color-bg)] bg-[var(--color-primary)] hover:opacity-90
                                ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <MessageCircle size={20} />
                            Chamar no WhatsApp
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
