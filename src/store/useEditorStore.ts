
import { create } from 'zustand';
import { BarbershopData } from '@/types/barbershop';

interface EditorState {
    isEditing: boolean;
    data: BarbershopData | null;
    originalData: BarbershopData | null;

    // UI State
    ui: {
        reviewsModalOpen: boolean;
    };
    toggleReviewsModal: (isOpen: boolean) => void;

    // Actions
    setInitialData: (data: BarbershopData) => void;
    toggleEditing: (isEditing?: boolean) => void;
    updateData: (newData: BarbershopData) => void;
    updateContent: (field: keyof BarbershopData['content'], value: any) => void;
    updateContact: (field: keyof BarbershopData['contact'], value: any) => void;
    updateService: (index: number, field: string, value: any) => void;
    updateGallery: (newGallery: string[]) => void;
    toggleProductsSection: (enable: boolean) => void;
    resetChanges: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
    isEditing: false,
    data: null,
    originalData: null,
    ui: {
        reviewsModalOpen: false
    },

    setInitialData: (data) => set({ data, originalData: data }),

    toggleReviewsModal: (isOpen) => set((state) => ({
        ui: { ...state.ui, reviewsModalOpen: isOpen }
    })),

    toggleEditing: (isEditing) => set((state) => ({
        isEditing: isEditing !== undefined ? isEditing : !state.isEditing
    })),

    updateData: (newData) => set({ data: newData }),

    updateContent: (field, value) => set((state) => {
        if (!state.data) return {};
        return {
            data: {
                ...state.data,
                content: {
                    ...state.data.content,
                    [field]: value
                }
            }
        };
    }),

    updateContact: (field, value) => set((state) => {
        if (!state.data) return {};
        return {
            data: {
                ...state.data,
                contact: {
                    ...state.data.contact,
                    [field]: value
                }
            }
        };
    }),

    updateService: (index, field, value) => set((state) => {
        if (!state.data) return {};
        const newServices = [...state.data.services];
        // Dynamic field access on service object - using Record type assertion
        newServices[index] = { ...newServices[index], [field]: value } as typeof newServices[number];
        return {
            data: {
                ...state.data,
                services: newServices
            }
        };
    }),

    updateGallery: (newGallery) => set((state) => {
        if (!state.data) return {};
        return {
            data: {
                ...state.data,
                gallery: newGallery
            }
        };
    }),

    toggleProductsSection: (enable) => set((state) => {
        if (!state.data) return {};

        const currentProducts = state.data.products || [];
        const shouldSeed = enable && currentProducts.length === 0;

        let newProducts = currentProducts;

        if (shouldSeed) {
            newProducts = [{
                id: crypto.randomUUID(),
                name: "Pomada Efeito Seco (Exemplo)",
                price: 35.00,
                description: "Produto de alta fixação para finalizar seu corte.",
                active: true,
                image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            }];
        }

        return {
            data: {
                ...state.data,
                content: {
                    ...state.data.content,
                    showProductsSection: enable
                },
                products: newProducts
            }
        };
    }),

    resetChanges: () => set((state) => ({ data: state.originalData }))
}));
