'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { BarbershopData } from '@/types/barbershop';
import { Loader2 } from 'lucide-react';
import TemplateClassic from '@/features/templates/components/TemplateClassic';
import TemplateModern from '@/features/templates/components/TemplateModern';
import TemplateUrban from '@/features/templates/components/TemplateUrban';
import ReviewsManager from '@/features/reviews/components/ReviewsManager';
import { AnimatePresence } from 'framer-motion';
import { Toast } from '@/components/ui/Toast';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import FAQSection from '@/components/ui/FAQSection';
import ContactSection from '@/components/ui/ContactSection';
import EditorSidebar from '@/features/editor/components/EditorSidebar';
import { useEditor } from '@/hooks/useEditor';
import { useEditorStore } from '@/store/useEditorStore';

export default function SiteEditorPage() {
    const { user } = useAuth();
    const router = useRouter();

    // Use Global Editor Store
    const {
        data,
        setInitialData,
        isEditing,
        updateData,
        updateContent
    } = useEditor();

    const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [confirmation, setConfirmation] = useState({ isOpen: false, title: '', description: '', action: () => { } });
    const isReviewsOpen = useEditorStore(state => state.ui?.reviewsModalOpen);
    const toggleReviewsModal = useEditorStore(state => state.toggleReviewsModal);

    useEffect(() => {
        const fetchBarbershop = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'barbershops', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    let rawData = docSnap.data() as any;

                    // Migration/Normalization for legacy data structure
                    if (!rawData.colors && rawData.content?.colors) {
                        rawData.colors = rawData.content.colors;
                    }

                    if (!rawData.contact && rawData.content?.contact) {
                        rawData.contact = rawData.content.contact;
                    }

                    if (!rawData.products) {
                        rawData.products = [];
                    }

                    // Fix retroactive: default isPublished to false if missing
                    if (rawData.isPublished === undefined) {
                        rawData.isPublished = false;
                    }

                    setInitialData(rawData as BarbershopData);
                }
            } catch (error) {
                console.error("Error fetching barbershop:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBarbershop();
    }, [user, setInitialData]);

    const handleUpdate = (newData: BarbershopData) => {
        updateData(newData);
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;
    }

    if (!data) {
        return <div className="flex h-screen items-center justify-center text-slate-400">Barbearia não encontrada.</div>;
    }

    const renderTemplate = () => {
        if (!data) return null;
        const props = {
            data: data,
            isEditing: isEditing,
            onUpdate: handleUpdate
        };

        switch (data.template_id) {
            case 'modern': return <TemplateModern {...props} />;
            case 'urban': return <TemplateUrban {...props} />;
            case 'classic': default: return <TemplateClassic {...props} />;
        }
    };



    return (
        <div className="flex flex-col lg:flex-row bg-slate-950 min-h-screen">
            {/* Mobile Tabs Navigation */}
            <div className="lg:hidden flex border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
                <button
                    onClick={() => setMobileTab('editor')}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${mobileTab === 'editor' ? 'text-blue-500 border-b-2 border-blue-500 bg-slate-900' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Editor
                </button>
                <button
                    onClick={() => setMobileTab('preview')}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${mobileTab === 'preview' ? 'text-blue-500 border-b-2 border-blue-500 bg-slate-900' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Preview
                </button>
            </div>

            {/* Editor Sidebar (Left Column) */}
            <div className={`${mobileTab === 'editor' ? 'block' : 'hidden'} lg:block relative z-40`}>
                <EditorSidebar />
            </div>

            {/* Preview Area (Right Column) */}
            <div className={`flex-1 transition-all duration-300 relative h-[calc(100vh-56px)] lg:h-screen overflow-hidden ${mobileTab === 'preview' ? 'block' : 'hidden'} lg:block`}>
                <div className="h-full overflow-y-auto scrollbar-hide relative w-full bg-slate-900/50">
                    {/* Mobile Mockup Handler */}
                    <div className={`transition-all duration-500 ${mobileTab === 'preview' ? 'scale-[0.85] origin-top mt-4' : 'scale-100'}`}>
                        <div
                            className={`min-h-full origin-top transform transition-all shadow-2xl ${data.template_id === 'urban' ? 'font-mono' : data.template_id === 'modern' ? 'font-sans' : 'font-serif'}`}
                            style={{
                                '--color-primary': data.colors.primary,
                                '--color-secondary': data.colors.secondary,
                                '--color-bg': data.colors.background || '#ffffff',
                                '--color-text': data.colors.text || '#111827',
                            } as React.CSSProperties}
                        >
                            {renderTemplate()}

                            {/* Global Sections (FAQ & Contact) */}
                            <div className="bg-[var(--color-bg)] text-[var(--color-text)]">
                                <FAQSection
                                    faq={data.faq || []}
                                    isEditing={isEditing}
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
                                    contact={data.contact}
                                    isEditing={isEditing}
                                    onUpdate={(field, value) => {
                                        handleUpdate({
                                            ...data,
                                            contact: { ...data.contact, [field]: value }
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Manager Modal (Triggered by Sidebar if needed or we move logic there) */}
            {/* For now, Sidebar doesn't have Review button, let's keep it accessible via temporary button or move to Sidebar */}
            {/* ... Actually, the previous toolbar had it. I should add Reviews trigger to Sidebar or keep it hidden for now until Plan says so. 
                The sidebar has 'Sections' tab disabled. I'll stick to the plan which focused on visual editing.
                Reviews are not strictly visual editing but data management.
            */}

            <ReviewsManager
                isOpen={!!isReviewsOpen}
                onClose={() => toggleReviewsModal(false)}
                reviews={data.reviews || []}
                onUpdate={(newReviews) => handleUpdate({ ...data, reviews: newReviews })}
            />

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
