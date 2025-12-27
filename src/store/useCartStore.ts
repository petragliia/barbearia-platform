import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/features/products/types';

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, delta: number) => void;
    clearCart: () => void;
    toggleCart: () => void;

    // Getters can be derived from state, but if explicit getters are needed as functions:
    getTotalPrice: () => number;
    getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product: Product) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === product.id);

                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                        isOpen: true, // Open cart when adding item (UX choice, can be removed)
                    });
                } else {
                    set({
                        items: [...currentItems, { ...product, quantity: 1 }],
                        isOpen: true,
                    });
                }
            },

            removeItem: (productId: string) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId),
                }));
            },

            updateQuantity: (productId: string, delta: number) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === productId);

                if (!existingItem) return;

                const newQuantity = existingItem.quantity + delta;

                if (newQuantity <= 0) {
                    // Remove item if quantity becomes 0 or less
                    set({
                        items: currentItems.filter((item) => item.id !== productId),
                    });
                } else {
                    set({
                        items: currentItems.map((item) =>
                            item.id === productId
                                ? { ...item, quantity: newQuantity }
                                : item
                        ),
                    });
                }
            },

            clearCart: () => set({ items: [] }),

            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage', // name of the item in the storage (must be unique)
            // storage: createJSONStorage(() => localStorage), // default is localStorage
            partialize: (state) => ({ items: state.items }), // Only persist items, not isOpen state
        }
    )
);
