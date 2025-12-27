import React from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../stores/useCartStore';
import { cn } from '@/lib/utils'; // Assuming this exists, typical in shadcn/ui. If not, I'll fallback or check.

interface ProductCardProps {
    product: Product;
    className?: string; // For adaptable themes
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
    const { items, addItem, updateQuantity } = useCartStore();
    const cartItem = items.find((item) => item.id === product.id);
    const quantity = cartItem?.quantity || 0;

    const handleAdd = () => {
        addItem(product);
    };

    const handleIncrement = () => {
        updateQuantity(product.id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 0) {
            updateQuantity(product.id, quantity - 1);
        }
    };

    // ... Inside component
    const isOutOfStock = product.stock === 0;

    // Volt style hover effect: Scale up slightly and add a glow
    return (
        <div
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-xl bg-white border border-transparent transition-all duration-300 ease-out",
                "hover:scale-[1.02] hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]",
                "dark:bg-zinc-900 dark:border-zinc-800",
                className,
                isOutOfStock && "opacity-75"
            )}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-zinc-800">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 font-bold text-white uppercase tracking-widest backdrop-blur-[2px]">
                        Esgotado
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2">
                    <h3 className="line-clamp-1 text-lg font-bold text-gray-900 dark:text-white">
                        {product.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                        {product.category} • {product.description}
                    </p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary">
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        }).format(product.price)}
                    </span>

                    {/* Logic: 
                        1. If Out of Stock -> Disabled Button
                        2. If In Stock & Qty 0 -> Add Button
                        3. If In Stock & Qty > 0 -> Counter
                    */}

                    {isOutOfStock ? (
                        <button
                            disabled
                            className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed dark:bg-zinc-800"
                        >
                            Indisponível
                        </button>
                    ) : quantity === 0 ? (
                        <button
                            onClick={handleAdd}
                            className={cn(
                                "flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors",
                                "hover:bg-primary/90 active:scale-95"
                            )}
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Adicionar
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-1">
                            <button
                                onClick={handleDecrement}
                                className="rounded-md p-1 hover:bg-white/50 hover:text-red-500 transition-colors dark:hover:bg-black/50"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-4 text-center text-sm font-medium tabular-nums">
                                {quantity}
                            </span>
                            <button
                                onClick={handleIncrement}
                                className="rounded-md p-1 hover:bg-white/50 hover:text-green-500 transition-colors dark:hover:bg-black/50"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
