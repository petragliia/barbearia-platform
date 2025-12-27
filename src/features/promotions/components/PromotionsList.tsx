'use client';

import { Promotion } from '@/features/promotions/types';
import { togglePromotion } from '@/app/actions/promotions';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Tag, ArrowRight } from 'lucide-react';
import { useTransition } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface Props {
    promotions: Promotion[];
}

export default function PromotionsList({ promotions }: Props) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleToggle = (id: string, currentStatus: boolean) => {
        startTransition(async () => {
            const result = await togglePromotion(id, !currentStatus);
            if (!result.success) {
                toast({ title: "Error", description: "Failed to update promotion", variant: "destructive" });
            }
        });
    };

    if (promotions.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                No active promotions. Create one above!
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {promotions.map(promo => (
                <Card key={promo.id} className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <Tag size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{promo.title}</h3>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                <span>Trigger: {promo.trigger_service_ids.join(', ')}</span>
                                <ArrowRight size={14} />
                                <span>Offer Product: {promo.offered_product_id} (Price: ${promo.discounted_price})</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${promo.active ? 'text-green-600' : 'text-gray-400'}`}>
                            {promo.active ? 'Active' : 'Inactive'}
                        </span>
                        <Switch
                            checked={promo.active}
                            onCheckedChange={() => handleToggle(promo.id, promo.active)}
                            disabled={isPending}
                        />
                    </div>
                </Card>
            ))}
        </div>
    );
}
