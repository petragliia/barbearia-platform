'use client';

import { useRef } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { BarbershopData } from '@/types/barbershop';

/**
 * StoreInitializer
 * 
 * This component is used to hydrate the client-side Zustand store with data 
 * fetched on the server (Server Component).
 * It ensures the store is initialized only once per request/render cycle.
 */
export default function StoreInitializer({
    data
}: {
    data: BarbershopData
}) {
    // Use a ref to track if we've initialized the store to avoid re-calls during re-renders
    const initialized = useRef(false);

    if (!initialized.current) {
        // Direct state mutation or using setState (Zustand vanilla api can be used)
        // Ideally use the setter action from the store
        useEditorStore.setState({
            data: data,
            originalData: data, // For "Cancel Changes" functionality
            isEditing: false
        });

        initialized.current = true;
    }

    return null;
}
