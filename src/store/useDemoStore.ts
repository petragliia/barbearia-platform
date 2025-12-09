import { create } from 'zustand';

interface DemoStore {
    showBooking: boolean;
    showMap: boolean;
    showReviews: boolean;
    enablePremiumEffects: boolean;
    toggleBooking: () => void;
    toggleMap: () => void;
    toggleReviews: () => void;
    togglePremiumEffects: () => void;
}

export const useDemoStore = create<DemoStore>((set) => ({
    showBooking: true,
    showMap: true,
    showReviews: true,
    enablePremiumEffects: true,
    toggleBooking: () => set((state) => ({ showBooking: !state.showBooking })),
    toggleMap: () => set((state) => ({ showMap: !state.showMap })),
    toggleReviews: () => set((state) => ({ showReviews: !state.showReviews })),
    togglePremiumEffects: () => set((state) => ({ enablePremiumEffects: !state.enablePremiumEffects })),
}));
