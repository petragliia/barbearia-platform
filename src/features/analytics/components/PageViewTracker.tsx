'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface PageViewTrackerProps {
    barbershopId: string;
}

export default function PageViewTracker({ barbershopId }: PageViewTrackerProps) {
    const initialized = useRef(false);
    const supabase = createClient();

    useEffect(() => {
        // Prevent double counting in Strict Mode or re-renders
        if (initialized.current) return;
        initialized.current = true;

        const trackView = async () => {
            if (!barbershopId) return;
            try {
                // Try RPC first if available (optimistic)
                const { error } = await supabase.rpc('increment_page_view', { row_id: barbershopId });

                if (error) {
                    // Fallback to Read-Write if RPC fails (or likely not exists)
                    // Note: This is prone to race conditions but acceptable for basic view counting
                    const { data } = await supabase
                        .from('barbershops')
                        .select('page_views')
                        .eq('id', barbershopId)
                        .single();

                    if (data) {
                        await supabase
                            .from('barbershops')
                            .update({ page_views: (data.page_views || 0) + 1 })
                            .eq('id', barbershopId);
                    }
                }
            } catch (error) {
                console.error("Error tracking page view:", error);
            }
        };

        trackView();
    }, [barbershopId, supabase]);

    return null;
}
