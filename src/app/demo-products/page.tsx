"use client";

import React from 'react';
import { ProductGrid } from '@/features/products/components/Public/ProductGrid';
import { CartDrawer } from '@/features/products/components/Public/CartDrawer';
import { CartFloatButton } from '@/features/products/components/Public/CartFloatButton';
import { Product } from '@/features/products/types';

// Mock Data
const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        barberId: 'demo',
        name: 'Pomada Modeladora Matte',
        description: 'Fixação forte com acabamento natural e sem brilho. Ideal para o dia a dia.',
        price: 45.90,
        imageUrl: 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?auto=format&fit=crop&q=80&w=800',
        stock: 10,
        active: true,
        createdAt: new Date(),
    },
    {
        id: '2',
        barberId: 'demo',
        name: 'Óleo para Barba Premium',
        description: 'Hidrata e macia a barba, com essência de madeira e notas cítricas.',
        price: 32.50,
        imageUrl: 'https://images.unsplash.com/photo-1626285862291-3c66804b7522?auto=format&fit=crop&q=80&w=800',
        stock: 15,
        active: true,
        createdAt: new Date(),
    },
    {
        id: '3',
        barberId: 'demo',
        name: 'Shampoo Mentolado 2 em 1',
        description: 'Limpeza profunda e refrescância para cabelo e barba.',
        price: 28.00,
        imageUrl: 'https://images.unsplash.com/photo-1556228720-1987ba42d829?auto=format&fit=crop&q=80&w=800',
        stock: 8,
        active: true,
        createdAt: new Date(),
    },
    {
        id: '4',
        barberId: 'demo',
        name: 'Kit Barba Completa',
        description: 'Shampoo, Óleo e Balm para o cuidado completo da sua barba.',
        price: 89.90,
        imageUrl: 'https://images.unsplash.com/photo-1626285861846-5a4155554366?auto=format&fit=crop&q=80&w=800',
        stock: 5,
        active: true,
        createdAt: new Date(),
    },
];

export default function ProductShowcaseDemo() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            {/* Mock Header */}
            <header className="border-b bg-white py-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                <div className="container mx-auto px-4">
                    <h1 className="text-xl font-bold">BarberShop Demo</h1>
                </div>
            </header>

            <main>
                <ProductGrid
                    products={MOCK_PRODUCTS}
                    title="Produtos em Destaque"
                />
            </main>

            <CartDrawer />
            <CartFloatButton />
        </div>
    );
}
