import { useEditor } from '@/features/editor/hooks/useEditor';
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
    ShoppingBag,
    GripVertical,
    LayoutTemplate,
    Image as ImageIcon,
    Sparkles,
    Info
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { Switch } from '@/components/ui/switch';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Simple Accordion Component
function AccordionItem({ title, icon: Icon, children, defaultOpen = false, id }: any) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style} className="border border-slate-200 rounded-lg overflow-hidden bg-white mb-3 shadow-sm">
            <div className="flex items-center bg-slate-50 border-b border-slate-100">
                <div
                    {...attributes}
                    {...listeners}
                    className="p-3 text-slate-400 cursor-grab hover:text-slate-600 hover:bg-slate-100 active:cursor-grabbing border-r border-slate-100"
                >
                    <GripVertical size={16} />
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex-1 flex items-center justify-between p-3 hover:bg-slate-100 transition-colors text-left"
                >
                    <div className="flex items-center gap-2 font-medium text-slate-700">
                        <Icon size={18} className="text-blue-500" />
                        {title}
                    </div>
                    {isOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 space-y-4 border-t border-slate-100 bg-white">
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
        updateData,
        updateContent,
        toggleProductsSection
    } = useEditor();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const toggleReviewsModal = useEditorStore(state => state.toggleReviewsModal);

    // Initial Default Sections
    const defaultSections = ['hero', 'services', 'transformation', 'about', 'gallery', 'products', 'reviews', 'contact'];
    const [items, setItems] = useState<string[]>([]);

    useEffect(() => {
        if (data && data.content.sections && data.content.sections.length > 0) {
            // Merge defaults to ensure new sections appear if they were added to the code but not DB
            const currentSections = data.content.sections;
            const missingSections = defaultSections.filter(s => !currentSections.includes(s));
            setItems([...currentSections, ...missingSections]);
        } else if (data) {
            setItems(defaultSections);
        }
    }, [data?.content.sections]);


    if (!data) return null;

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id as string);
                const newIndex = items.indexOf(over.id as string);
                const newOrder = arrayMove(items, oldIndex, newIndex);

                // Persist to global store
                updateData({
                    ...data,
                    content: {
                        ...data.content,
                        sections: newOrder
                    }
                });

                return newOrder;
            });
        }
    };


    const handleAddService = () => {
        const newServices = [...data.services, { name: 'Novo Serviço', price: 0, duration: '30 min' }];
        updateData({ ...data, services: newServices });
    };

    const handleRemoveService = (index: number) => {
        const newServices = [...data.services];
        newServices.splice(index, 1);
        updateData({ ...data, services: newServices });
    };

    const renderSectionContent = (id: string) => {
        switch (id) {
            case 'hero':
                return (
                    <AccordionItem key={id} id={id} title="Hero (Capa)" icon={LayoutTemplate}>
                        <div className="space-y-3">
                            <p className="text-xs text-slate-500">A seção principal do seu site. Edite a imagem na aba "Identidade Visual".</p>
                            <div className="space-y-1">
                                <Label className="text-xs">Título Principal</Label>
                                <Input
                                    value={data.name || ''} // Usually name is used, or maybe separate hero_title
                                    onChange={(e) => updateData({ ...data, name: e.target.value })}
                                    placeholder="Nome da Barbearia"
                                    className="h-8 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Descrição Curta</Label>
                                <textarea
                                    value={data.content.description || ''}
                                    onChange={(e) => updateContent('description', e.target.value)}
                                    placeholder="Uma breve descrição sobre sua barbearia..."
                                    className="flex min-h-[60px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </AccordionItem>
                );
            case 'gallery':
                return (
                    <AccordionItem key={id} id={id} title="Galeria de Fotos" icon={ImageIcon}>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Título da Seção</Label>
                                <Input
                                    value={data.content.gallery_title || ''}
                                    onChange={(e) => updateContent('gallery_title', e.target.value)}
                                    placeholder="Ex: Editorial Visual"
                                    className="h-8 text-sm"
                                />
                            </div>
                            <p className="text-xs text-slate-500">Edite as fotos diretamente no Preview clicando sobre elas ou adicionando novas.</p>
                        </div>
                    </AccordionItem>
                );
            case 'transformation':
                // Only relevant for Modern? We show it anyway, maybe with a note.
                return (
                    <AccordionItem key={id} id={id} title="Transformação (Antes/Depois)" icon={Sparkles}>
                        <div className="space-y-3">
                            <p className="text-xs text-slate-500">Seção exclusiva do tema <strong>Modern</strong>. Compare o antes e depois.</p>
                            <div className="p-3 bg-slate-50 rounded text-xs text-slate-400 text-center border border-dashed">
                                Edição de imagens disponível apenas no Preview.
                            </div>
                        </div>
                    </AccordionItem>
                );
            case 'about':
                return (
                    <AccordionItem key={id} id={id} title="Sobre & Diferenciais" icon={Info}>
                        <div className="space-y-3">
                            <p className="text-xs text-slate-500">Seção de destaque do tema <strong>Urban</strong>.</p>
                            <div className="space-y-1">
                                <Label className="text-xs">Título Sobre</Label>
                                <Input
                                    value={data.content.about_title_middle || ''}
                                    onChange={(e) => updateContent('about_title_middle', e.target.value)}
                                    placeholder="Ex: Aceitamos"
                                    className="h-8 text-sm"
                                />
                            </div>
                        </div>
                    </AccordionItem>
                );
            case 'contact':
                return (
                    <AccordionItem key={id} id={id} title="Contato & Localização" icon={MapPin}>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Endereço</Label>
                                <Input
                                    value={data.contact.address}
                                    onChange={(e) => updateContact('address', e.target.value)}
                                    placeholder="Rua Exemplo, 123"
                                    className="h-8 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">WhatsApp</Label>
                                <div className="relative">
                                    <MessageCircle size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                                    <Input
                                        value={data.contact.whatsapp}
                                        onChange={(e) => updateContact('whatsapp', e.target.value)}
                                        placeholder="5511999999999"
                                        className="h-8 text-sm pl-8"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Telefone</Label>
                                <div className="relative">
                                    <Phone size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                                    <Input
                                        value={data.contact.phone}
                                        onChange={(e) => updateContact('phone', e.target.value)}
                                        placeholder="(11) 3333-3333"
                                        className="h-8 text-sm pl-8"
                                    />
                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                );
            case 'services':
                return (
                    <AccordionItem key={id} id={id} title="Serviços" icon={Scissors}>
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
                );
            case 'products':
                return (
                    <AccordionItem key={id} id={id} title="Loja de Produtos" icon={ShoppingBag}>
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
                );
            case 'reviews':
                return (
                    <AccordionItem key={id} id={id} title="Avaliações" icon={Star}>
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
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="px-1">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 px-2">Gerenciar e Reordenar Seções</h3>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {items.map(id => renderSectionContent(id))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}
