'use client';

import { Product } from '@/features/products/types';
import { useCartStore } from '@/store/useCartStore';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils'; // Assuming this utility exists, widely used in modern stacks

export type ThemeVariant = 'classic' | 'modern' | 'urban';

interface ProductCardProps {
    product: Product;
    theme?: ThemeVariant;
}

export default function ProductCard({ product, theme = 'modern' }: ProductCardProps) {
    const { items, addItem, updateQuantity } = useCartStore();

    // Check if product is in cart
    const cartItem = items.find(item => item.id === product.id);
    const quantity = cartItem?.quantity || 0;

    const handleAdd = () => {
        addItem(product);
    };

    const handleIncrement = () => {
        updateQuantity(product.id, 1);
    };

    const handleDecrement = () => {
        updateQuantity(product.id, -1);
    };

    // Theme Styles
    const themeStyles = {
        classic: {
            font: 'font-serif',
            borderRadius: 'rounded-sm',
            button: 'bg-[#d4af37] text-white hover:bg-[#b5952f]',
            price: 'text-[#d4af37]',
            border: 'border-[#d4af37]/20',
        },
        modern: {
            font: 'font-sans',
            borderRadius: 'rounded-2xl',
            button: 'bg-black text-white hover:bg-gray-800',
            price: 'text-black',
            border: 'border-slate-200',
        },
        urban: {
            font: 'font-sans uppercase tracking-wide',
            borderRadius: 'rounded-none',
            button: 'bg-red-600 text-white hover:bg-red-700',
            price: 'text-red-500',
            border: 'border-white/10 bg-zinc-900 text-white',
        }
    };

    const styles = themeStyles[theme];

    return (
        <div className={cn(
            "group relative overflow-hidden bg-white hover:shadow-lg transition-all duration-300 border flex flex-col",
            styles.borderRadius,
            styles.border
        )}>
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <ShoppingBag size={32} opacity={0.3} />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className={cn(
                    "text-lg font-bold leading-tight mb-1 line-clamp-2",
                    styles.font,
                    theme === 'urban' ? 'text-white' : 'text-gray-900'
                )}>
                    {product.name}
                </h3>

                <p className={cn(
                    "text-lg font-bold mt-auto mb-4",
                    styles.price
                )}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </p>

                {/* Interactive Button */}
                <div className="mt-auto">
                    {quantity > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex items-center justify-between px-3 py-2 w-full",
                                theme === 'urban' ? 'bg-zinc-800' : 'bg-gray-100',
                                styles.borderRadius
                            )}
                        >
                            <button
                                onClick={handleDecrement}
                                className={cn(
                                    "p-1 hover:bg-black/10 rounded transition-colors",
                                    theme === 'urban' ? 'text-white hover:bg-white/10' : 'text-gray-600'
                                )}
                            >
                                <Minus size={16} />
                            </button>
                            <span className={cn(
                                "font-bold text-sm",
                                theme === 'urban' ? 'text-white' : 'text-gray-900'
                            )}>{quantity}</span>
                            <button
                                onClick={handleIncrement}
                                className={cn(
                                    "p-1 hover:bg-black/10 rounded transition-colors",
                                    theme === 'urban' ? 'text-white hover:bg-white/10' : 'text-gray-600'
                                )}
                            >
                                <Plus size={16} />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAdd}
                            className={cn(
                                "w-full py-3 px-4 flex items-center justify-center gap-2 font-bold text-sm transition-colors",
                                styles.borderRadius,
                                styles.button
                            )}
                        >
                            <ShoppingBag size={18} />
                            Adicionar
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
}
