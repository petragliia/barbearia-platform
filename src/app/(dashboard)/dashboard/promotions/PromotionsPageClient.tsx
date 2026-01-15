'use client';

import { useAuth } from '@/features/auth/context/AuthContext';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { useEffect, useState } from 'react';
import { getBarbershopByOwner } from '@/app/actions/barbershop';
import { getPromotions } from '@/app/actions/promotions';
import { productService } from '@/features/products/services/productService';
import PromotionsList from '@/features/promotions/components/PromotionsList';
import CreatePromotionForm from '@/features/promotions/components/CreatePromotionForm';
import { Promotion } from '@/features/promotions/types';
import { BarbershopData } from '@/types/barbershop';
import { Product } from '@/features/products/types';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PromotionsPageClient() {
    const { user, loading: authLoading } = useAuth();
    const { can, plan, loading: permLoading } = usePermission();

    // Feature Gating Checks

    // Data
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [barbershop, setBarbershop] = useState<BarbershopData | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!user) return;

        // Check Permissions (Assuming 'products' permission serves as proxy, OR we added 'promotions' key)
        // Prompt says: "If plan === 'STARTER', block... PRO/EMPIRE allowed".
        // Current plans: FREE, STARTER, PRO, BUSINESS.
        // Assuming we need to check if plan is >= PRO.
        // `usePermission` uses `canUser`. We can check `plan` directly.

        async function load() {
            try {
                const shop = await getBarbershopByOwner(user!.id);
                if (shop) {
                    setBarbershop(shop);

                    // Fetch Promotions
                    const promoResult = await getPromotions(shop.id);
                    if (promoResult.success && promoResult.promotions) {
                        setPromotions(promoResult.promotions);
                    }

                    // Fetch Products
                    const { data: prods } = await productService.getProductsByBarberId(shop.id, plan);
                    setProducts(prods || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingData(false);
            }
        }

        load();
    }, [user]);

    // Derived permission state
    // const { plan } = usePermission(); // Already destructured above
    // Assuming PRO+ access.
    const hasAccess = plan === 'PRO' || plan === 'BUSINESS';

    if (authLoading || permLoading || loadingData) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    if (!hasAccess) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                <div className="bg-slate-100 p-6 rounded-full">
                    <Lock size={48} className="text-slate-400" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Feature Locked</h1>
                <p className="text-slate-500 max-w-md">
                    Smart Upsells & Promotions are available exclusively for <strong>PRO</strong> and <strong>Business</strong> plans.
                    Boost your revenue by offering automatic deals!
                </p>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-6 px-8 text-lg hover:opacity-90">
                    <Link href="/dashboard/plan">Upgrade to PRO</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Smart Promotions</h1>
                <p className="text-slate-500">Create automatic upsell offers triggered by specific services.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Create New Offer</h2>
                    <CreatePromotionForm
                        services={barbershop?.services || []}
                        products={products}
                        onSuccess={() => {
                            // Refresh list locally
                            if (barbershop) {
                                getPromotions(barbershop.id).then(res => {
                                    if (res.promotions) setPromotions(res.promotions);
                                });
                            }
                        }}
                    />
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Active Promotions</h2>
                    <PromotionsList promotions={promotions} />
                </div>
            </div>
        </div>
    );
}
