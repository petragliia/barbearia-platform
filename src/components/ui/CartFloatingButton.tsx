'use client';

import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartFloatingButton() {
    const { toggleCart, getTotalItems } = useCartStore();
    const totalItems = getTotalItems();

    if (totalItems === 0) return null;

    return (
        <AnimatePresence>
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCart}
                className="fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
            >
                <ShoppingBag size={24} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                    {totalItems}
                </span>
            </motion.button>
        </AnimatePresence>
    );
}
