'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/features/products/types';
import { productService } from '@/features/products/services/productService';
import ProductCard, { ThemeVariant } from './ProductCard';
import { ShoppingBag } from 'lucide-react';

interface ShopSectionProps {
    barberId: string;
    theme?: ThemeVariant;
}

export default function ShopSection({ barberId, theme = 'modern' }: ShopSectionProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetched = await productService.getProductsByBarberId(barberId);
                // Filter only active products with stock > 0 (optional, business rule)
                const activeProducts = fetched.filter(p => p.active !== false && p.stock > 0);
                setProducts(activeProducts);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        if (barberId) {
            fetchProducts();
        }
    }, [barberId]);

    if (loading) return null; // Or a skeleton, but prompt suggests "If empty return null" logic for empty list.
    if (products.length === 0) return null;

    // Theme Config for Section Headers
    const sectionStyles = {
        classic: {
            title: "font-serif text-[#d4af37]",
            subtitle: "text-gray-500 font-serif italic"
        },
        modern: {
            title: "font-bold text-gray-900 tracking-tight",
            subtitle: "text-gray-500"
        },
        urban: {
            title: "font-black uppercase text-white",
            subtitle: "text-gray-400"
        },
        volt: {
            title: "font-bold text-blue-500 uppercase tracking-widest",
            subtitle: "text-blue-400/80"
        }
    };

    const style = sectionStyles[theme];

    return (
        <section className={`py-16 px-4 md:px-8 ${theme === 'urban' ? 'bg-black' : 'bg-transparent'}`}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl md:text-4xl mb-3 flex items-center justify-center gap-3 ${style.title}`}>
                        <ShoppingBag size={32} />
                        Nossos Produtos
                    </h2>
                    <p className={`text-lg ${style.subtitle}`}>
                        Leve a experiência da barbearia para sua casa.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            theme={theme}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
