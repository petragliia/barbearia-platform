
import { useEditorStore } from '@/store/useEditorStore';

export function useEditor() {
    const store = useEditorStore();
    return {
        isEditing: store.isEditing,
        data: store.data,
        setInitialData: store.setInitialData,
        toggleEditing: store.toggleEditing,
        updateData: store.updateData,
        updateContent: store.updateContent,
        updateContact: store.updateContact,
        updateService: store.updateService,
        updateGallery: store.updateGallery,
        toggleProductsSection: store.toggleProductsSection,
        resetChanges: store.resetChanges,
        hasChanges: JSON.stringify(store.data) !== JSON.stringify(store.originalData)
    };
}
