import { Product } from '../types';

export const DEFAULT_PRODUCTS: Product[] = [
    // --- Categoria: Cabelo ---
    {
        id: "prod_cab_01",
        barberId: 'default',
        name: "Pomada Modeladora Efeito Matte",
        category: "Cabelo",
        price: 35.00,
        stock: 20,
        description: "Fixação forte sem brilho. Ideal para cortes modernos e estruturados que precisam durar o dia todo.",
        imageUrl: "https://images.unsplash.com/photo-1626301646729-e58f001201f1?q=80&w=600&auto=format&fit=crop", // Placeholder real-ish image
        active: true,
        createdAt: new Date().toISOString()
    },
    {
        id: "prod_cab_02",
        barberId: 'default',
        name: "Gel Cola Extra Forte",
        category: "Cabelo",
        price: 25.00,
        stock: 15,
        description: "O clássico brilho molhado com fixação extrema. Perfeito para penteados retro e slick back.",
        imageUrl: "https://images.unsplash.com/photo-1556228720-1957be83f324?q=80&w=600&auto=format&fit=crop",
        active: true,
        createdAt: new Date().toISOString()
    },
    {
        id: "prod_cab_03",
        barberId: 'default',
        name: "Shampoo Ice Mentolado",
        category: "Cabelo",
        price: 28.90,
        stock: 10,
        description: "Limpeza profunda com sensação refrescante. Controla a oleosidade e revigora o couro cabeludo.",
        imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600&auto=format&fit=crop",
        active: true,
        createdAt: new Date().toISOString()
    },

    // --- Categoria: Barba ---
    {
        id: "prod_bar_01",
        barberId: 'default',
        name: "Óleo de Barba Lenhador",
        category: "Barba",
        price: 42.00,
        stock: 12,
        description: "Hidratação intensa para barbas longas e ressecadas. Evita coceira e deixa um aroma amadeirado suave.",
        imageUrl: "https://images.unsplash.com/photo-1626301646875-0e6d5815668e?q=80&w=600&auto=format&fit=crop",
        active: true,
        createdAt: new Date().toISOString()
    },
    {
        id: "prod_bar_02",
        barberId: 'default',
        name: "Balm Pós-Barba Hidratante",
        category: "Barba",
        price: 38.00,
        stock: 18,
        description: "Alinha os fios rebeldes e acalma a pele após o barbear. Toque seco, não deixa o rosto oleoso.",
        imageUrl: "https://images.unsplash.com/photo-1621607512214-68297f31358a?q=80&w=600&auto=format&fit=crop",
        active: true,
        createdAt: new Date().toISOString()
    },
    {
        id: "prod_bar_03",
        barberId: 'default',
        name: "Kit Minoxidil Turbo (Tônico)",
        category: "Barba",
        price: 89.90,
        stock: 5,
        description: "Tônico fortificante para preenchimento de falhas e estímulo de crescimento dos fios.",
        imageUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=600&auto=format&fit=crop",
        active: true,
        createdAt: new Date().toISOString()
    },

    // --- Categoria: Acessórios ---
    {
        id: "prod_ace_01",
        barberId: 'default',
        name: "Pente de Madeira Antiestático",
        category: "Acessórios",
        price: 15.00,
        stock: 30,
        description: "Ideal para alinhar a barba sem causar frizz. Compacto para levar no bolso.",
        imageUrl: "https://images.unsplash.com/photo-1590159763121-7c9631d21927?q=80&w=600&auto=format&fit=crop",
        active: true,
        createdAt: new Date().toISOString()
    }
];
