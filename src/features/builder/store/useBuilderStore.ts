import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { BarbershopData } from '@/types/barbershop';

export type SectionType = 'hero' | 'services' | 'testimonials' | 'gallery' | 'about' | 'contact' | 'custom';

export interface BuilderSection {
    id: string;
    type: SectionType;
    isVisible: boolean;
    content: Record<string, any>;
    title?: string; // For the builder UI
}

interface BuilderState {
    sections: BuilderSection[];
    activeSectionId: string | null;
    // Actions
    initializeSections: (initialData?: BarbershopData) => void;
    addSection: (type: SectionType) => void;
    removeSection: (id: string) => void;
    reorderSections: (newSections: BuilderSection[]) => void;
    updateSectionContent: (id: string, newContent: Record<string, any>) => void;
    toggleSectionVisibility: (id: string) => void;
    setActiveSection: (id: string | null) => void;
}

// Helper to generate default content based on type
const getDefaultContent = (type: SectionType) => {
    switch (type) {
        case 'hero':
            return { title: 'Bem-vindo', subtitle: 'Sua barbearia', cta: 'Agendar' };
        case 'services':
            return { title: 'Nossos Serviços', items: [] };
        case 'testimonials':
            return { title: 'O que dizem', reviews: [] };
        default:
            return {};
    }
};

export const useBuilderStore = create<BuilderState>((set) => ({
    sections: [],
    activeSectionId: null,

    initializeSections: (initialData) => {
        // In a real app, we would parse initialData to reconstruct sections.
        // For now, we will seed with default sections if empty.
        const defaultSections: BuilderSection[] = [
            { id: '1', type: 'hero', isVisible: true, content: {}, title: 'Hero Section' },
            { id: '2', type: 'services', isVisible: true, content: {}, title: 'Serviços' },
            { id: '3', type: 'testimonials', isVisible: true, content: {}, title: 'Depoimentos' },
            { id: '4', type: 'gallery', isVisible: true, content: {}, title: 'Galeria' },
            { id: '5', type: 'contact', isVisible: true, content: {}, title: 'Contato' },
        ];
        set({ sections: defaultSections });
    },

    addSection: (type) =>
        set((state) => ({
            sections: [
                ...state.sections,
                {
                    id: uuidv4(),
                    type,
                    isVisible: true,
                    content: getDefaultContent(type),
                    title: `Nova Seção ${type}`,
                },
            ],
        })),

    removeSection: (id) =>
        set((state) => ({
            sections: state.sections.filter((s) => s.id !== id),
        })),

    reorderSections: (newSections) => set({ sections: newSections }),

    updateSectionContent: (id, newContent) =>
        set((state) => ({
            sections: state.sections.map((s) =>
                s.id === id ? { ...s, content: { ...s.content, ...newContent } } : s
            ),
        })),

    toggleSectionVisibility: (id) =>
        set((state) => ({
            sections: state.sections.map((s) =>
                s.id === id ? { ...s, isVisible: !s.isVisible } : s
            ),
        })),

    setActiveSection: (id) => set({ activeSectionId: id }),
}));
