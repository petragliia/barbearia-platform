"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({
    isOpen,
    onClose,
    title,
    children
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-700 flex max-h-[90vh] flex-col"
            >
                <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
                    <h3 className="text-lg font-bold text-slate-100">{title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="overflow-y-auto p-6">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
