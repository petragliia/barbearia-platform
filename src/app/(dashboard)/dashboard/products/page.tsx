"use client";

import { useEffect, useState } from "react";
import { ProductManager } from "@/features/products/components/Admin/ProductManager";
import { productService } from "@/features/products/services/productService";
import { Product } from "@/features/products/types";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { usePermission } from "@/features/auth/hooks/usePermission";

export default function ProductsPage() {
    const { user } = useAuth();
    const { plan } = usePermission();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const barberId = user?.id || '';

    useEffect(() => {
        if (!barberId) return;
        let mounted = true;

        const loadProducts = async () => {
            try {
                // Pass plan to service
                let { data: fetchedProducts } = await productService.getProductsByBarberId(barberId, plan);

                // Auto-Initialize if empty (legacy logic kept, but maybe check permission?)
                // If hasPermission is false, fetchedProducts is empty.
                // We should probably NOT seed if permission is denied.

                // For now, simple fix for type compatibility:
                fetchedProducts = fetchedProducts || [];

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
    }, [barberId, plan]);

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
