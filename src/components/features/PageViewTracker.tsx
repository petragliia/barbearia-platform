'use client';

import { useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

interface PageViewTrackerProps {
    barbershopId: string;
}

export default function PageViewTracker({ barbershopId }: PageViewTrackerProps) {
    const initialized = useRef(false);

    useEffect(() => {
        // Prevent double counting in Strict Mode or re-renders
        if (initialized.current) return;
        initialized.current = true;

        const trackView = async () => {
            try {
                const userRef = doc(db, 'users', barbershopId);
                await updateDoc(userRef, {
                    pageViews: increment(1)
                });
            } catch (error) {
                console.error("Error tracking page view:", error);
            }
        };

        trackView();
    }, [barbershopId]);

    return null;
}
