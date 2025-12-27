'use client';

import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation'; // Get dynamic params
import { useCheckout } from '@/features/shop/hooks/useCheckout';
import { toast } from 'sonner';

export default function CartDrawer() {
    const { items, isOpen, toggleCart, updateQuantity, getTotalPrice } = useCartStore();
    const totalPrice = getTotalPrice();
    const params = useParams();
    const { checkout, isPending } = useCheckout();

    const handleCheckout = async () => {
        // Try getting slug from URL, fallback to 'demo' if testing in isolation (though ideally shouldn't happen)
        // In a real WaaS, explicit Context is better, but this solves the "hardcoded" issue for the dynamic route.
        const currentSlug = typeof params?.slug === 'string' ? params.slug : undefined;
        // If we strictly need an ID, we'd loop up context. For now, sending slug to API is robust enough.

        try {
            await checkout({
                items,
                slug: currentSlug,
                barberId: currentSlug ? undefined : 'demo-fallback'
            });
        } catch (error: any) {
            toast.error('Não foi possível iniciar o checkout', {
                description: error.message || 'Tente novamente mais tarde.'
            });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ShoppingBag className="text-black" />
                                Seu Carrinho
                            </h2>
                            <button
                                onClick={toggleCart}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body - Cart Items */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
                                    <ShoppingBag size={48} className="text-gray-300 opacity-50" />
                                    <p>Seu carrinho está vazio.</p>
                                    <button
                                        onClick={toggleCart}
                                        className="text-sm font-bold text-black border-b border-black pb-0.5 hover:opacity-70"
                                    >
                                        Continuar comprando
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        {/* Image */}
                                        <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                            {item.imageUrl ? (
                                                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-gray-300">
                                                    <ShoppingBag size={20} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                                                <p className="text-xs text-gray-500">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)} unit.
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                {/* Qty Control */}
                                                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-2 py-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="text-gray-500 hover:text-red-500"
                                                    >
                                                        {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                                                    </button>
                                                    <span className="text-sm font-bold text-gray-900 w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="text-gray-500 hover:text-black"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <p className="font-bold text-gray-900 text-sm">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-500 text-sm">Subtotal</span>
                                    <span className="text-xl font-bold text-gray-900">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
                                    </span>
                                </div>
                                <button
                                    data-testid="checkout-btn"
                                    onClick={handleCheckout}
                                    disabled={isPending}
                                    className="w-full py-4 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors shadow-lg hover:shadow-xl transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isPending ? <Loader2 className="animate-spin" /> : 'Finalizar Compra'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
