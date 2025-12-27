'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePromotionSchema, CreatePromotionInput } from '@/features/promotions/types';
import { createPromotion } from '@/app/actions/promotions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useState } from 'react';
import { BarbershopData, Service } from '@/types/barbershop';
import { Product } from '@/features/products/types';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Props {
    services: Service[];
    products: Product[];
    onSuccess?: () => void;
}

export default function CreatePromotionForm({ services, products, onSuccess }: Props) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<CreatePromotionInput>({
        resolver: zodResolver(CreatePromotionSchema),
        defaultValues: {
            active: true
        }
    });

    const onSubmit = async (data: CreatePromotionInput) => {
        if (!user) return;
        setIsLoading(true);

        try {
            const result = await createPromotion(user.uid, data);

            if (result.success) {
                toast({ title: "Promotion created!", description: "The promotion has been successfully created." });
                form.reset();
                onSuccess?.();
            } else {
                toast({ title: "Error", description: result.error || "An error occurred", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <div>
                <Label>Promotion Title</Label>
                <Input {...form.register('title')} placeholder="e.g. Combo Corte + Pomada" />
                {form.formState.errors.title && <span className="text-red-500 text-sm">{form.formState.errors.title.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label>When client books...</Label>
                    <select
                        {...form.register('trigger_service_ids.0')} // Simplification: Single trigger for MVP
                        className="w-full border rounded-md p-2 text-sm"
                    >
                        <option value="">Select a Service</option>
                        {services.map((s, i) => (
                            // Fallback to name if ID missing, but schema expects string.
                            // We really need IDs. Using index or name as fallback.
                            // Assuming we updated Service to have ID or match by name.
                            <option key={i} value={s.name}>{s.name} ({s.duration})</option>
                        ))}
                    </select>
                    {form.formState.errors.trigger_service_ids && <span className="text-red-500 text-sm">Select a service</span>}
                </div>

                <div>
                    <Label>Offer this product...</Label>
                    <select
                        {...form.register('offered_product_id')}
                        className="w-full border rounded-md p-2 text-sm"
                    >
                        <option value="">Select a Product</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (Original: ${p.price})</option>
                        ))}
                    </select>
                    {form.formState.errors.offered_product_id && <span className="text-red-500 text-sm">{form.formState.errors.offered_product_id.message}</span>}
                </div>
            </div>

            <div>
                <Label>For the price of...</Label>
                <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <Input
                        type="number"
                        step="0.01"
                        {...form.register('discounted_price', { valueAsNumber: true })}
                        className="pl-8"
                        placeholder="0.00"
                    />
                </div>
                {form.formState.errors.discounted_price && <span className="text-red-500 text-sm">{form.formState.errors.discounted_price.message}</span>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Offer
            </Button>
        </form>
    );
}
