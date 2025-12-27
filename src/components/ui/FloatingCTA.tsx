'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FloatingCTAProps {
    onClick: () => void;
    showAfter?: number;
}

export default function FloatingCTA({ onClick, showAfter = 500 }: FloatingCTAProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > showAfter) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [showAfter]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 right-6 z-50 md:bottom-10 md:right-10"
                >
                    <button
                        onClick={onClick}
                        className="
                            flex items-center gap-3 px-6 py-4 
                            bg-classic-gold text-classic-bg 
                            font-serif font-bold uppercase tracking-wider
                            shadow-[0_10px_30px_rgba(212,175,55,0.3)]
                            hover:bg-white hover:text-classic-gold
                            transition-all duration-300 rounded-sm
                        "
                    >
                        <Calendar className="w-5 h-5" />
                        <span className="hidden md:inline">Agendar Horário</span>
                        <span className="md:hidden">Agendar</span>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
