import React, { useEffect } from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

export const CartDrawer = () => {
    const { items, isOpen, closeCart, updateQuantity, removeItem, getCartTotal } = useCartStore();

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeCart();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, closeCart]);

    // Prevent background scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className={cn(
                "relative z-10 w-full max-w-md bg-white shadow-xl dark:bg-zinc-900 flex flex-col h-full animate-in slide-in-from-right duration-300"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-bold">Seu Carrinho</h2>
                        <span className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {items.length} itens
                        </span>
                    </div>
                    <button
                        onClick={closeCart}
                        className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                            <ShoppingBag className="mb-4 h-16 w-16 opacity-20" />
                            <p className="text-lg font-medium">Seu carrinho está vazio</p>
                            <p className="text-sm">Adicione produtos para ver eles aqui.</p>
                            <button
                                onClick={closeCart}
                                className="mt-6 rounded-lg border px-6 py-2 text-sm font-medium hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                            >
                                Continuar comprando
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    {/* Thumbnail */}
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border dark:border-zinc-800">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <h3 className="line-clamp-1 font-medium">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center w-24 rounded-lg border dark:border-zinc-700">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="flex h-7 w-8 items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800"
                                                >
                                                    -
                                                </button>
                                                <span className="flex-1 text-center text-xs font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="flex h-7 w-8 items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer / Summary */}
                {items.length > 0 && (
                    <div className="border-t bg-gray-50 p-6 dark:bg-zinc-800/50 dark:border-zinc-800">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-base font-medium">Subtotal</span>
                            <span className="text-xl font-bold">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getCartTotal())}
                            </span>
                        </div>

                        <button
                            onClick={() => {
                                const total = getCartTotal();
                                const formattedTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);

                                let message = `*Novo Pedido - BarberSaaS*%0A%0A`;
                                items.forEach(item => {
                                    message += `• ${item.quantity}x ${item.name} - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}%0A`;
                                });
                                message += `%0A*Total: ${formattedTotal}*`;

                                // Replace with actual barber phone from context/props if available, currently mocking or prompting user to update
                                const phoneNumber = "5511999999999";
                                window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                            }}
                            className="w-full rounded-xl bg-primary py-3.5 text-center font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 active:scale-[0.98]"
                        >
                            Finalizar Pedido via WhatsApp
                        </button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
