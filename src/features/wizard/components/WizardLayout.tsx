'use client';

import { useState, useEffect, Suspense } from 'react';
import { useWizardStore } from '@/store/useWizardStore';
import { useAuth } from '@/features/auth/context/AuthContext';
import { createCheckoutSession } from '@/lib/services/paymentService';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import StepTemplate from '@/features/wizard/components/steps/StepTemplate';
import StepInfo from '@/features/wizard/components/steps/StepInfo';
import StepServices from '@/features/wizard/components/steps/StepServices';
import StepReview from '@/features/wizard/components/steps/StepReview';
import { useRouter, useSearchParams } from 'next/navigation';

function WizardContent() {
    const { step, setStep, selectedTemplate, barbershopData, setTemplate, selectedAddons, setPlan, selectedPlan } = useWizardStore();
    const { user, signInAnonymous } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const totalSteps = 4;

    useEffect(() => {
        const templateParam = searchParams.get('selectedTemplate');
        if (templateParam && ['classic', 'modern', 'urban'].includes(templateParam)) {
            setTemplate(templateParam as 'classic' | 'modern' | 'urban');
            // Auto-advance to step 2 if template is pre-selected
            setStep(2);
        }

        const planParam = searchParams.get('plan');
        if (planParam && ['starter', 'pro', 'empire'].includes(planParam)) {
            setPlan(planParam as 'starter' | 'pro' | 'empire');
        }
    }, [searchParams, setTemplate, setStep, setPlan]);

    const handleNext = async () => {
        // Validation
        if (step === 1 && !selectedTemplate) return;
        if (step === 2 && (!barbershopData.name || !barbershopData.slug || !barbershopData.whatsapp)) return;
        if (step === 3 && barbershopData.services.length === 0) return;

        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            // Final Step: Create Barbershop
            setIsSaving(true);
            try {
                let currentUser = user;
                if (!currentUser) {
                    currentUser = await signInAnonymous();
                }

                if (!currentUser) throw new Error('Falha na autenticação');

                // Map store data to full BarbershopData structure
                const fullData: any = {
                    slug: barbershopData.slug,
                    template_id: selectedTemplate,
                    content: {
                        name: barbershopData.name,
                        description: 'A melhor barbearia da região.', // Default
                        hero_image: getTemplateImage(selectedTemplate),
                        colors: getTemplateColors(selectedTemplate),
                        contact: {
                            phone: barbershopData.whatsapp,
                            whatsapp: barbershopData.whatsapp,
                            address: 'Endereço não informado', // Default
                        }
                    },
                    services: barbershopData.services,
                    gallery: [], // Empty for now
                };

                // Initiate Payment Flow
                await createCheckoutSession(fullData, currentUser.uid, selectedAddons, selectedPlan);

            } catch (error) {
                console.error(error);
                alert('Erro ao iniciar pagamento. Tente novamente.');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            router.push('/');
        }
    };

    const isNextDisabled = () => {
        if (step === 1) return !selectedTemplate;
        if (step === 2) return !barbershopData.name || !barbershopData.slug || !barbershopData.whatsapp;
        if (step === 3) return barbershopData.services.length === 0;
        if (step === 4) return isSaving;
        return false;
    };

    const renderStep = () => {
        switch (step) {
            case 1: return <StepTemplate />;
            case 2: return <StepInfo />;
            case 3: return <StepServices />;
            case 4: return <StepReview />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header / Progress Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="container mx-auto max-w-3xl">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                            Passo {step} de {totalSteps}
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                            {Math.round((step / totalSteps) * 100)}%
                        </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-500 ease-out"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 container mx-auto max-w-3xl py-8 px-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[400px] p-6">
                    {renderStep()}
                </div>
            </main>

            {/* Footer / Navigation */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
                <div className="container mx-auto max-w-3xl flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors ${isSaving
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <ArrowLeft size={20} />
                        Voltar
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={isNextDisabled()}
                        className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${step === 4
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {isSaving ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : step === 4 ? (
                            'Finalizar e Ir para Pagamento'
                        ) : (
                            <>
                                Próximo
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helpers for default data
function getTemplateImage(id: string | null) {
    switch (id) {
        case 'classic': return 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop';
        case 'modern': return 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop';
        case 'urban': return 'https://images.unsplash.com/photo-1599351431202-6e0000a96994?q=80&w=1000&auto=format&fit=crop';
        default: return '';
    }
}

function getTemplateColors(id: string | null) {
    switch (id) {
        case 'classic': return { primary: '#d4af37', secondary: '#1a1a1a' };
        case 'modern': return { primary: '#38bdf8', secondary: '#ffffff' };
        case 'urban': return { primary: '#ef4444', secondary: '#1f2937' };
        default: return { primary: '#000000', secondary: '#ffffff' };
    }
}

export default function WizardLayout() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>}>
            <WizardContent />
        </Suspense>
    );
}
