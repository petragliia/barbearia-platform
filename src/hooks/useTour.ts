import { useEffect } from 'react';
import { driver } from 'driver.js';
import "driver.js/dist/driver.css";
import { dashboardSteps, editorSteps } from '@/lib/tour-steps';

// Simple theme override for driver.js popover to match dark mode
const driverThemeConfig = {
    animate: true,
    opacity: 0.75,
    overlayColor: '#000000', // Darker overlay
    showProgress: true,
    doneBtnText: 'Concluído',
    nextBtnText: 'Próximo',
    prevBtnText: 'Anterior',
    progressText: '{{current}} de {{total}}',
    popoverClass: 'driver-popover-dark', // We will need to add this class in global css if standard styles aren't enough
};

export function useTour(tourType: 'dashboard' | 'editor') {
    useEffect(() => {
        // Check if tour has effectively been completed
        const storageKey = `barbersaas-tour-completed-${tourType}`;
        const isCompleted = localStorage.getItem(storageKey);

        if (isCompleted) return;

        // Select steps based on type
        const steps = tourType === 'dashboard' ? dashboardSteps : editorSteps;

        // Wait a bit for elements to render
        const timer = setTimeout(() => {
            const driverObj = driver({
                ...driverThemeConfig,
                steps: steps,
                onDestroyStarted: () => {
                    // Only mark as completed on natural finish or if user skips? 
                    // Usually mark on destroy so it doesn't pop up again unless manually triggered.
                    // However, driver.js 'onDestroyStarted' is called when user clicks overlay or X.
                    // If we want to persist "seen", we do it here.
                    if (!driverObj.hasNextStep() || confirm("Pular tutorial?")) {
                        localStorage.setItem(storageKey, 'true');
                        driverObj.destroy();
                    }
                },
                // Forcing simple mark complete on exit for MVP to avoid annoyance
                onPopoverRender: (popover, { config, state }) => {
                    // Custom styling injection if needed via JS directly to popover content
                    popover.wrapper.style.borderRadius = '12px';
                }
            });

            // Allow manual closing to mark as done mostly
            // We'll simplify: just mark done once started to avoid annoyance loops, 
            // OR mark done when destroy is called.

            // Let's refine the destruction handler:
            // If the user effectively closes it, we consider it "seen" enough so we don't spam.
            // Using a simpler config for the hook.

            driverObj.drive();

            // Mark as seen immediately to prevent double firing in React StrictMode dev
            // But ideally we mark on finish. 
            // Let's stick to standard behavior: mark when destroyed.
            // Be careful with React StrictMode running effects twice.

        }, 1500); // 1.5s delay to ensure UI is ready

        return () => clearTimeout(timer);
    }, [tourType]);
}
