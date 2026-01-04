"use client";

import { useEffect, useState } from "react";
import { ProductManager } from "@/features/products/components/Admin/ProductManager";
import { productService } from "@/features/products/services/productService";
import { Product } from "@/features/products/types";
import { Loader2 } from "lucide-react";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    // In a real app with auth, we would get the barberId from the session/context
    const barberId = "default";

    useEffect(() => {
        let mounted = true;

        const loadProducts = async () => {
            try {
                let fetchedProducts = await productService.getProductsByBarberId(barberId);

                // Auto-Initialize if empty
                if (fetchedProducts.length === 0) {
                    console.log("No products found. Auto-seeding defaults (client)...");
                    await productService.seedProducts(barberId);
                    fetchedProducts = await productService.getProductsByBarberId(barberId);
                }

                if (mounted) {
                    setProducts(fetchedProducts);
                }
            } catch (error) {
                console.error("Failed to load products:", error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 md:p-8">
            <ProductManager
                initialProducts={products}
                barberId={barberId}
            />
        </div>
    );
}
