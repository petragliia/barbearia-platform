import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

export const CartFloatButton = () => {
    const { toggleCart, getCartCount } = useCartStore();
    const count = getCartCount();

    if (count === 0) return null;

    return createPortal(
        <button
            data-testid="cart-trigger"
            onClick={toggleCart}
            className={cn(
                "fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-black px-6 py-4 shadow-xl transition-transform hover:scale-105 active:scale-95 dark:bg-white",
                "animate-in zoom-in duration-300"
            )}
        >
            <div className="relative">
                <ShoppingBag className="h-6 w-6 text-white dark:text-black" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {count}
                </span>
            </div>
            <span className="font-bold text-white dark:text-black">Ver Carrinho</span>
        </button>,
        document.body
    );
};
