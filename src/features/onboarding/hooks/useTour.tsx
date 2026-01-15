'use client';

import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { dashboardSteps, editorSteps } from '@/lib/tour-steps';

type TourType = 'dashboard' | 'editor';

/**
 * Hook to manage the onboarding tour using Driver.js
 * 
 * @param tourType - Identify which tour to run ('dashboard' or 'editor')
 * @returns startTour function to manually trigger the tour
 */
export function useTour(tourType: TourType) {
    const hasRun = useRef(false);

    const startTour = () => {
        const steps = tourType === 'dashboard' ? dashboardSteps : editorSteps;

        const driverObj = driver({
            showProgress: true,
            steps: steps,
            animate: true,
            // Dark Mode Styling for Popover
            popoverClass: 'driverjs-theme',
            onDestroyStarted: () => {
                // Save completion status
                localStorage.setItem(`tour-completed-${tourType}`, 'true');
                driverObj.destroy();
            },
            nextBtnText: 'Próximo →',
            prevBtnText: '← Anterior',
            doneBtnText: 'Concluir'
        });

        driverObj.drive();
    };

    useEffect(() => {
        // Prevent double execution in strict mode or re-renders
        if (hasRun.current) return;

        // Check local storage
        const isCompleted = localStorage.getItem(`tour-completed-${tourType}`);

        if (!isCompleted) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                startTour();
                hasRun.current = true;
            }, 1000); // 1s delay for better UX

            return () => clearTimeout(timer);
        }
    }, [tourType]);

    return { startTour };
}
