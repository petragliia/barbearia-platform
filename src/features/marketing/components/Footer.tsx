'use client';

import { BarbershopData } from '@/types/barbershop';
import { MapPin, Phone, Instagram } from 'lucide-react';
import EditableText from '@/components/ui/EditableText';
import { clsx } from 'clsx';

interface FooterProps {
    data: BarbershopData;
    isEditing?: boolean;
    onUpdate?: (data: BarbershopData) => void;
    templateId?: string;
}

export default function Footer({ data, isEditing, onUpdate, templateId = 'classic' }: FooterProps) {
    const { name, contact } = data;
    const isModern = templateId === 'modern';
    const isUrban = templateId === 'urban';

    // Handler for updating nested contact info
    const updateContact = (field: keyof typeof contact, value: string) => {
        if (onUpdate) {
            onUpdate({
                ...data,
                contact: {
                    ...contact,
                    [field]: value
                }
            });
        }
    };

    // --- CLASSIC FOOTER ---
    if (!isModern && !isUrban) {
        return (
            <footer className="bg-black py-20 px-6 border-t border-[var(--color-primary)]/30 font-serif">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-serif text-[var(--color-primary)] mb-8">{name}</h2>

                    <div className="flex flex-col md:flex-row justify-center gap-12 mb-12 text-white/80 font-sans tracking-wide">
                        <div className="flex items-center justify-center gap-3">
                            <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                            <EditableText
                                as="span"
                                isEditing={!!isEditing}
                                value={contact.phone}
                                onChange={(val) => updateContact('phone', val)}
                            />
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                            <EditableText
                                as="span"
                                isEditing={!!isEditing}
                                value={contact.address}
                                onChange={(val) => updateContact('address', val)}
                            />
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <Instagram className="w-5 h-5 text-[var(--color-primary)]" />
                            <span>@{(name || "barbearia").replace(/\s+/g, '').toLowerCase()}</span>
                        </div>
                    </div>

                    <p className="text-[var(--color-primary)]/30 text-xs tracking-widest uppercase">
                        © {new Date().getFullYear()} {name}. All rights reserved.
                    </p>
                </div>
            </footer>
        );
    }

    // --- URBAN FOOTER ---
    if (isUrban) {
        return (
            <footer id="location" className="bg-[#080808] border-t border-[var(--color-text)]/5 pt-24 pb-12 px-6 font-mono">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 mb-24">
                        <div>
                            <h2 className="text-4xl font-black text-[var(--color-text)] uppercase mb-8">
                                <span className="text-[var(--color-primary)]">⚡</span> {name}
                            </h2>
                            <p className="text-gray-400 max-w-sm mb-12">
                                O ponto de encontro para quem busca excelência, estilo e uma experiência única.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-gray-300">
                                    <MapPin className="text-[var(--color-primary)]" />
                                    <EditableText
                                        as="span"
                                        isEditing={!!isEditing}
                                        value={contact.address}
                                        onChange={(val) => updateContact('address', val)}
                                    />
                                </div>
                                <div className="flex items-center gap-4 text-gray-300">
                                    <Phone className="text-[var(--color-primary)]" />
                                    <EditableText
                                        as="span"
                                        isEditing={!!isEditing}
                                        value={contact.phone}
                                        onChange={(val) => updateContact('phone', val)}
                                    />
                                </div>
                                <div className="flex items-center gap-4 text-gray-300">
                                    <Instagram className="text-[var(--color-primary)]" />
                                    <div className="flex">
                                        <span>@</span>
                                        <EditableText
                                            as="span"
                                            isEditing={!!isEditing}
                                            value={contact.instagram ?? "barbearia"}
                                            onChange={(val) => updateContact('instagram', val)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center md:justify-end">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-[var(--color-text)] mb-6 uppercase">Pronto para Mudar?</h3>
                                {/* Simple Call to Action removed for simplicity or add functionality if needed */}
                                <div className="bg-[var(--color-primary)] text-black font-black uppercase tracking-wider py-4 px-8 inline-block select-none cursor-not-allowed opacity-80">
                                    Agende Online
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8 text-center text-gray-600 text-sm">
                        <p>&copy; {new Date().getFullYear()} {name}. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        );
    }

    // --- MODERN FOOTER ---
    return (
        <footer id="location" className="bg-black text-white pt-24 pb-12 px-6 font-sans">
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
                            isEditing={!!isEditing}
                            value={contact.address}
                            onChange={(val) => updateContact('address', val)}
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
                            isEditing={!!isEditing}
                            value={contact.phone}
                            onChange={(val) => updateContact('phone', val)}
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
    );
}
