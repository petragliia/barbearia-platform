import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

interface ProductGridProps {
    products: Product[];
    title?: string;
    className?: string;
}

export const ProductGrid = ({ products, title = "Nossos Produtos", className }: ProductGridProps) => {
    return (
        <section className={cn("w-full py-12", className)}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {title}
                        </h2>
                        {/* Optional: Filter or Sort controls could go here */}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
