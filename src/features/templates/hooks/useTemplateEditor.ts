import { BarbershopData } from '@/types/barbershop';

interface UseTemplateEditorProps {
    data: BarbershopData;
    onUpdate?: (data: BarbershopData) => void;
}

export function useTemplateEditor({ data, onUpdate }: UseTemplateEditorProps) {
    const updateContent = (field: keyof typeof data.content, value: any) => {
        if (!onUpdate) return;
        onUpdate({
            ...data,
            content: { ...data.content, [field]: value }
        });
    };

    const updateContact = (field: keyof typeof data.content.contact, value: string) => {
        if (!onUpdate) return;
        onUpdate({
            ...data,
            content: {
                ...data.content,
                contact: { ...data.content.contact, [field]: value }
            }
        });
    };

    const updateService = (index: number, field: 'name' | 'price' | 'duration', value: any) => {
        if (!onUpdate) return;
        const newServices = [...data.services];
        newServices[index] = { ...newServices[index], [field]: value };
        onUpdate({ ...data, services: newServices });
    };

    const updateGallery = (index: number, url: string) => {
        if (!onUpdate) return;
        const newGallery = [...data.gallery];
        newGallery[index] = url;
        onUpdate({ ...data, gallery: newGallery });
    };

    return {
        updateContent,
        updateContact,
        updateService,
        updateGallery
    };
}
