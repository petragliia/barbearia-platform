// Simplified toast hook
import { Toast } from "./Toast";
import { useState, useEffect } from "react";

// For now, this is a placeholder to satisfy the import. 
// A real system would use a Context Provider.
// I'll make it return a dummy function that logs to console for now, 
// OR I can use window.alert if I want immediate feedback, but that's ugly.
// Better: Create a minimal global store for toasts.

import { create } from 'zustand';

interface ToastData {
    id: string;
    title: string;
    description: string;
    variant?: 'default' | 'destructive' | 'success';
    className?: string;
}

interface ToastState {
    toasts: ToastData[];
    addToast: (toast: Omit<ToastData, 'id'>) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function useToast() {
    const { addToast, removeToast, toasts } = useToastStore();

    return {
        toast: (props: Omit<ToastData, 'id'>) => {
            addToast(props);
        },
        dismiss: (id: string) => removeToast(id),
        toasts
    };
}
