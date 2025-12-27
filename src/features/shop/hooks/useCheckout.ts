import { useState } from 'react';
import { CartItem } from '@/features/products/types';

interface CheckoutOptions {
    items: CartItem[];
    // We accept either ID or Slug, allowing flexibility for the API to resolve it.
    barberId?: string;
    slug?: string;
}

export function useCheckout() {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkout = async ({ items, barberId, slug }: CheckoutOptions) => {
        setIsPending(true);
        setError(null);

        try {
            const response = await fetch('/api/shop/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items,
                    barberId,
                    slug, // Pass slug if available
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao iniciar checkout.');
            }

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('URL de redirecionamento não encontrada.');
            }
        } catch (err: any) {
            console.error('Checkout error:', err);
            setError(err.message || 'Erro de conexão.');
            // Here we could assume a toast trigger if passed as callback, 
            // but returning error state allows UI to handle it.
            throw err;
        } finally {
            setIsPending(false);
        }
    };

    return {
        checkout,
        isPending,
        error
    };
}
