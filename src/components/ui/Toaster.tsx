"use client";

import { useToastStore } from "./use-toast";
import { Toast } from "./Toast";
import { AnimatePresence } from "framer-motion";

export function Toaster() {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed bottom-0 right-0 z-[100] flex flex-col p-4 gap-2 w-full max-w-[420px] pointer-events-none">
            <AnimatePresence mode="sync">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            message={toast.title + (toast.description ? `: ${toast.description}` : "")}
                            onClose={() => removeToast(toast.id)}
                            type={toast.variant === 'destructive' ? 'error' : 'success'}
                        />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}
