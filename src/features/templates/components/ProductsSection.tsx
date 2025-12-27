import React from 'react';
import { Product } from '@/types/barbershop';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ProductsSectionProps {
    products: Product[];
}

export default function ProductsSection({ products }: ProductsSectionProps) {
    if (!products || products.length === 0) return null;

    const activeProducts = products.filter(p => p.active);

    if (activeProducts.length === 0) return null;

    return (
        <section className="py-20 bg-[var(--color-bg)] text-[var(--color-text)] relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 bg-[var(--color-primary)] rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-48 h-48 bg-[var(--color-secondary)] rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <Badge variant="outline" className="mb-4 border-[var(--color-primary)] text-[var(--color-primary)]">
                        Shop
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Nossos <span className="text-[var(--color-primary)]">Produtos</span>
                    </h2>
                    <p className="opacity-80 text-lg">
                        Leve a qualidade da barbearia para sua casa com nossa linha exclusiva.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {activeProducts.map((product) => (
                        <div
                            key={product.id}
                            className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--color-primary)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--color-primary)]/10"
                            style={{
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            {/* Image Container */}
                            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ShoppingBag size={48} strokeWidth={1} />
                                    </div>
                                )}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                                    {product.name}
                                </h3>

                                {product.description && (
                                    <p className="text-sm opacity-60 mb-4 line-clamp-2 h-10">
                                        {product.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-lg font-bold">
                                        R$ {product.price.toFixed(2)}
                                    </span>
                                    <Button
                                        size="icon"
                                        className="rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white shadow-lg"
                                    >
                                        <ShoppingBag size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all uppercase tracking-widest text-sm font-bold"
                    >
                        Ver Todos os Produtos
                    </Button>
                </div>
            </div>
        </section>
    );
}
