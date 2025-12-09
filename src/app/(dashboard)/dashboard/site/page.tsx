'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { BarbershopData } from '@/types/barbershop';
import { Button } from '@/components/ui/button';
import { ExternalLink, Save, Loader2, LayoutTemplate, Check } from 'lucide-react';
import TemplateClassic from '@/features/templates/components/TemplateClassic';
import TemplateModern from '@/features/templates/components/TemplateModern';
import TemplateUrban from '@/features/templates/components/TemplateUrban';
import ReviewsManager from '@/features/reviews/components/ReviewsManager';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, MessageSquare } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';
import ThemeEditor from '@/features/customization/components/ThemeEditor';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import FAQSection from '@/components/ui/FAQSection';
import ContactSection from '@/components/ui/ContactSection';

const TEMPLATES = [
    {
        id: 'classic',
        name: 'Classic Gentleman',
        description: 'Elegância tradicional com tons dourados e serifas.',
        color: '#d4af37',
        image: '/img/classicgentleman.png',
    },
    {
        id: 'modern',
        name: 'Modern Minimalist',
        description: 'Design limpo, foco em fotos e tipografia moderna.',
        color: '#38bdf8',
        image: '/img/modernminimalist.png',
        recommended: true,
    },
    {
        id: 'urban',
        name: 'Urban Style',
        description: 'Visual dark, industrial e impactante.',
        color: '#ef4444',
        image: '/img/urbanstyle.png',
    },
];

export default function SiteEditorPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<BarbershopData | null>(null);
    const [isSelectingTemplate, setIsSelectingTemplate] = useState(false);
    const [isReviewsOpen, setIsReviewsOpen] = useState(false);
    const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);

    // UI States
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [confirmation, setConfirmation] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        action: () => void;
    }>({
        isOpen: false,
        title: '',
        description: '',
        action: () => { },
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'barbershops', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const fetchedData = docSnap.data() as BarbershopData;
                    setData(fetchedData);
                    if (!fetchedData.template_id) {
                        setIsSelectingTemplate(true);
                    }
                } else {
                    // No data found, initialize with defaults for creation
                    setIsSelectingTemplate(true);
                    setData({
                        id: user.uid,
                        slug: '', // Will need to be set or generated
                        template_id: 'classic', // Default, will be overwritten
                        content: {
                            name: user.displayName || 'Minha Barbearia',
                            description: 'A melhor barbearia da região.',
                            hero_image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop',
                            colors: { primary: '#d4af37', secondary: '#000000' },
                            contact: { phone: '', address: '', whatsapp: '' }
                        },
                        services: [],
                        gallery: []
                    } as BarbershopData);
                }
            } catch (error) {
                console.error("Error fetching site data:", error);
                setToast({ message: "Erro ao carregar dados.", type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleUpdate = async (newData: BarbershopData) => {
        setData(newData);
        // Auto-save or debounce could be implemented here.
        // For now, we update local state and let user click "Save" or auto-save on specific events if the template calls it.
        // Actually, the templates call onUpdate for every change. 
        // Let's implement a debounced save or just save immediately for simplicity in this MVP, 
        // but to avoid too many writes, maybe just update local state and have a manual save button?
        // The prompt said "live preview", usually implies "what you see is what you get".
        // Let's update local state immediately, and maybe trigger a background save or rely on the manual save button for "publishing".
        // But the user might expect it to be saved. 
        // Let's stick to: Update Local State -> User clicks Save. 
        // OR: Update Local State -> Debounced Save.

        // For this implementation, I'll update local state and provide a prominent "Save Changes" button.
    };

    const saveChanges = async () => {
        if (!user || !data) return;
        setSaving(true);
        try {
            const docRef = doc(db, 'barbershops', user.uid);
            // Use setDoc with merge: true to handle both create and update
            await setDoc(docRef, data, { merge: true });
            setToast({ message: "Alterações salvas com sucesso!", type: 'success' });
        } catch (error) {
            console.error("Error saving changes:", error);
            setToast({ message: "Erro ao salvar alterações.", type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const confirmTemplateChange = () => {
        setConfirmation({
            isOpen: true,
            title: 'Trocar Modelo do Site',
            description: 'Ao trocar de modelo, algumas personalizações visuais podem ser perdidas. O conteúdo (serviços, fotos, textos) será mantido. Deseja continuar?',
            action: () => {
                setIsSelectingTemplate(true);
                setConfirmation(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleTemplateSelect = async (templateId: string) => {
        if (!user || !data) return;

        // Update local state immediately
        const newData = { ...data, template_id: templateId as BarbershopData['template_id'] };

        // If it's a new site (no slug), generate one from name or uid
        if (!newData.slug) {
            newData.slug = newData.content.name.toLowerCase().replace(/\s+/g, '-') + '-' + user.uid.slice(0, 4);
        }

        setData(newData);
        setIsSelectingTemplate(false);

        // Save to Firestore (Create if doesn't exist)
        setSaving(true);
        try {
            const docRef = doc(db, 'barbershops', user.uid);
            await setDoc(docRef, newData, { merge: true });
        } catch (error) {
            console.error("Error saving template:", error);
            alert("Erro ao salvar modelo.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
    );

    if (!data) return <div className="p-8 text-center">Nenhum dado encontrado.</div>;

    if (isSelectingTemplate) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Escolha o Modelo do Site</h1>
                        <p className="text-slate-500">Selecione o estilo que mais combina com sua barbearia.</p>
                    </div>
                    {data.template_id && (
                        <Button variant="ghost" onClick={() => setIsSelectingTemplate(false)}>
                            Cancelar
                        </Button>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {TEMPLATES.map((template) => {
                        const isSelected = data.template_id === template.id;
                        return (
                            <motion.div
                                key={template.id}
                                onClick={() => handleTemplateSelect(template.id)}
                                whileHover={{ y: -5 }}
                                className={`
                                    relative group cursor-pointer rounded-xl overflow-hidden border-2 bg-white transition-all
                                    ${isSelected ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'}
                                `}
                            >
                                {template.recommended && (
                                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                                        Recomendado
                                    </div>
                                )}
                                {isSelected && (
                                    <div className="absolute top-3 left-3 bg-blue-600 text-white rounded-full p-1 z-10">
                                        <Check size={16} />
                                    </div>
                                )}
                                <div className="aspect-[4/5] bg-slate-100 relative">
                                    <img
                                        src={template.image}
                                        alt={template.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                    <div className="absolute bottom-0 left-0 p-4 text-white">
                                        <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                                        <p className="text-xs text-slate-300 line-clamp-2">{template.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        );
    }

    const renderTemplate = () => {
        const props = {
            data: data,
            isEditing: true,
            onUpdate: handleUpdate
        };

        switch (data.template_id) {
            case 'modern': return <TemplateModern {...props} />;
            case 'urban': return <TemplateUrban {...props} />;
            case 'classic': default: return <TemplateClassic {...props} />;
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Editor Toolbar */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div>
                    <h1 className="font-bold text-slate-900">Editor do Site</h1>
                    <p className="text-xs text-slate-500">Clique nos textos e imagens para editar.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={confirmTemplateChange}>
                        <LayoutTemplate size={16} className="mr-2" />
                        Trocar Modelo
                    </Button>

                    <div className="relative">
                        <Button variant="outline" onClick={() => setIsThemeEditorOpen(!isThemeEditorOpen)} className={isThemeEditorOpen ? 'bg-slate-100' : ''}>
                            <Palette size={16} className="mr-2" />
                            Cores
                        </Button>

                        {isThemeEditorOpen && data && (
                            <div className="absolute top-full right-0 mt-2 z-50">
                                <ThemeEditor
                                    colors={data.content.colors}
                                    onUpdate={(newColors) => handleUpdate({
                                        ...data,
                                        content: { ...data.content, colors: newColors }
                                    })}
                                />
                            </div>
                        )}
                    </div>

                    <Button variant="outline" onClick={() => setIsReviewsOpen(true)}>
                        <MessageSquare size={16} className="mr-2" />
                        Avaliações
                    </Button>
                    <Button variant="outline" onClick={() => window.open(`/${data.slug}`, '_blank')}>
                        <ExternalLink size={16} className="mr-2" />
                        Ver Online
                    </Button>
                    <Button onClick={saveChanges} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
                        {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                        Salvar Alterações
                    </Button>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-auto bg-slate-100 relative">
                <div className="min-h-full origin-top transform transition-all pb-20">
                    {renderTemplate()}

                    {/* Global Sections (FAQ & Contact) */}
                    {data && (
                        <div className="bg-white">
                            <FAQSection
                                faq={data.faq || []}
                                isEditing={true}
                                onUpdate={(index, field, value) => {
                                    const newFaq = [...(data.faq || [])];
                                    newFaq[index] = { ...newFaq[index], [field]: value };
                                    handleUpdate({ ...data, faq: newFaq });
                                }}
                                onAdd={() => {
                                    const newFaq = [...(data.faq || []), { question: "Nova Pergunta", answer: "Nova Resposta" }];
                                    handleUpdate({ ...data, faq: newFaq });
                                }}
                                onRemove={(index) => {
                                    const newFaq = [...(data.faq || [])];
                                    newFaq.splice(index, 1);
                                    handleUpdate({ ...data, faq: newFaq });
                                }}
                            />
                            <ContactSection
                                contact={data.content.contact}
                                isEditing={true}
                                onUpdate={(field, value) => {
                                    handleUpdate({
                                        ...data,
                                        content: {
                                            ...data.content,
                                            contact: { ...data.content.contact, [field]: value }
                                        }
                                    });
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Manager Modal */}
            {data && (
                <ReviewsManager
                    isOpen={isReviewsOpen}
                    onClose={() => setIsReviewsOpen(false)}
                    reviews={data.reviews || []}
                    onUpdate={(newReviews) => handleUpdate({ ...data, reviews: newReviews })}
                />
            )}

            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={confirmation.isOpen}
                title={confirmation.title}
                description={confirmation.description}
                onConfirm={confirmation.action}
                onCancel={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}
