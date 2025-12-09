import { create } from 'zustand';

interface Service {
    name: string;
    price: number;
    duration: string;
}

interface BarbershopData {
    name: string;
    slug: string;
    whatsapp: string;
    services: Service[];
}

interface WizardState {
    step: number;
    selectedTemplate: 'classic' | 'modern' | 'urban' | null;
    barbershopData: BarbershopData;
    setStep: (step: number) => void;
    setTemplate: (template: 'classic' | 'modern' | 'urban') => void;
    updateData: (data: Partial<BarbershopData>) => void;
    addService: (service: Service) => void;
    removeService: (index: number) => void;
    selectedAddons: string[];
    toggleAddon: (addonId: string) => void;
    selectedPlan: 'free' | 'starter' | 'pro' | 'empire';
    setPlan: (plan: 'free' | 'starter' | 'pro' | 'empire') => void;
}

export const useWizardStore = create<WizardState>((set) => ({
    step: 1,
    selectedTemplate: null,
    barbershopData: {
        name: '',
        slug: '',
        whatsapp: '',
        services: [],
    },
    selectedAddons: [],
    selectedPlan: 'starter', // Default
    setStep: (step) => set({ step }),
    setTemplate: (template) => set({ selectedTemplate: template }),
    setPlan: (plan) => set({ selectedPlan: plan }),
    updateData: (data) =>
        set((state) => ({
            barbershopData: { ...state.barbershopData, ...data },
        })),
    addService: (service) =>
        set((state) => ({
            barbershopData: {
                ...state.barbershopData,
                services: [...state.barbershopData.services, service],
            },
        })),
    removeService: (index) =>
        set((state) => ({
            barbershopData: {
                ...state.barbershopData,
                services: state.barbershopData.services.filter((_, i) => i !== index),
            },
        })),
    toggleAddon: (addonId) =>
        set((state) => {
            const isSelected = state.selectedAddons.includes(addonId);
            return {
                selectedAddons: isSelected
                    ? state.selectedAddons.filter((id) => id !== addonId)
                    : [...state.selectedAddons, addonId],
            };
        }),
}));
