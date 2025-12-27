'use client';

import { useEditor } from '@/hooks/useEditor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    MapPin,
    Phone,
    MessageCircle,
    Star,
    Scissors,
    Plus,
    Trash2,
    ChevronDown,
    ChevronRight,
    Map,
    ShoppingBag
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useEditorStore } from '@/store/useEditorStore';
import { Switch } from '@/components/ui/switch';

// Simple Accordion Component for internal use
function AccordionItem({ title, icon: Icon, children, defaultOpen = false }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white mb-3">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
                <div className="flex items-center gap-2 font-medium text-slate-700">
                    <Icon size={18} className="text-blue-500" />
                    {title}
                </div>
                {isOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 space-y-4 border-t border-slate-200">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function SectionsEditor() {
    const {
        data,
        updateContact,
        updateService,
        updateData, // For generic updates like adding a service
        toggleProductsSection
    } = useEditor();

    // Direct store access for the specific UI toggle we added
    const toggleReviewsModal = useEditorStore(state => state.toggleReviewsModal);

    if (!data) return null;

    const handleAddService = () => {
        const newServices = [...data.services, { name: 'Novo Serviço', price: 0, duration: '30 min' }];
        updateData({ ...data, services: newServices });
    };

    const handleRemoveService = (index: number) => {
        const newServices = [...data.services];
        newServices.splice(index, 1);
        updateData({ ...data, services: newServices });
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="px-1">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 px-2">Gerenciar Seções</h3>

                {/* Contact & Location */}
                <AccordionItem title="Contato & Localização" icon={MapPin} defaultOpen={true}>
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <Label className="text-xs">Endereço</Label>
                            <Input
                                value={data.content.contact.address}
                                onChange={(e) => updateContact('address', e.target.value)}
                                placeholder="Rua Exemplo, 123"
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">WhatsApp (para agendamento)</Label>
                            <div className="relative">
                                <MessageCircle size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                                <Input
                                    value={data.content.contact.whatsapp}
                                    onChange={(e) => updateContact('whatsapp', e.target.value)}
                                    placeholder="5511999999999"
                                    className="h-8 text-sm pl-8"
                                />
                            </div>
                            <p className="text-[10px] text-slate-500">Este número será usado no botão de agendamento.</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Telefone</Label>
                            <div className="relative">
                                <Phone size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                                <Input
                                    value={data.content.contact.phone}
                                    onChange={(e) => updateContact('phone', e.target.value)}
                                    placeholder="(11) 3333-3333"
                                    className="h-8 text-sm pl-8"
                                />
                            </div>
                        </div>
                    </div>
                </AccordionItem>

                {/* Services */}
                <AccordionItem title="Serviços" icon={Scissors}>
                    <div className="space-y-4">
                        {data.services.map((service, index) => (
                            <div key={index} className="space-y-2 p-3 bg-slate-50 rounded border border-slate-100 relative group">
                                <button
                                    onClick={() => handleRemoveService(index)}
                                    className="absolute right-2 top-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Remover serviço"
                                >
                                    <Trash2 size={14} />
                                </button>
                                <div className="space-y-1">
                                    <Label className="text-xs">Nome</Label>
                                    <Input
                                        value={service.name}
                                        onChange={(e) => updateService(index, 'name', e.target.value)}
                                        className="h-8 text-sm bg-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Preço (R$)</Label>
                                        <Input
                                            type="number"
                                            value={service.price}
                                            onChange={(e) => updateService(index, 'price', Number(e.target.value))}
                                            className="h-8 text-sm bg-white"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Duração</Label>
                                        <Input
                                            value={service.duration}
                                            onChange={(e) => updateService(index, 'duration', e.target.value)}
                                            className="h-8 text-sm bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button
                            onClick={handleAddService}
                            variant="outline"
                            className="w-full text-xs h-8 border-dashed"
                        >
                            <Plus size={14} className="mr-1" /> Adicionar Serviço
                        </Button>
                    </div>
                </AccordionItem>

                {/* Products Section Toggle */}
                <AccordionItem title="Loja de Produtos" icon={ShoppingBag}>
                    <div className="flex items-center justify-between p-2">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium">Exibir Produtos</Label>
                            <p className="text-[10px] text-slate-500">Mostre seus produtos à venda na página inicial.</p>
                        </div>
                        <Switch
                            checked={data.content.showProductsSection || false}
                            onCheckedChange={() => toggleProductsSection(!data.content.showProductsSection)}
                        />
                    </div>
                </AccordionItem>

                {/* Reviews */}
                <AccordionItem title="Avaliações" icon={Star}>
                    <div className="text-center py-2 space-y-3">
                        <p className="text-xs text-slate-500">Gerencie os depoimentos dos seus clientes.</p>
                        <Button
                            onClick={() => toggleReviewsModal(true)}
                            className="w-full h-8 text-xs bg-slate-900 text-white"
                        >
                            Gerenciar Avaliações
                        </Button>
                    </div>
                </AccordionItem>
            </div>
        </div>
    );
}
