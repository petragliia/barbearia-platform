'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, User } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Review } from '@/features/reviews/types';

interface SocialProofWidgetProps {
    templateId: string;
    reviews?: Review[];
}

const DEFAULT_REVIEWS = [
    { name: 'Carlos Silva', text: 'Melhor corte da região! Atendimento top.', rating: 5 },
    { name: 'João Souza', text: 'Ambiente incrível e profissionais qualificados.', rating: 5 },
    { name: 'Pedro Santos', text: 'Sempre saio satisfeito. Recomendo muito!', rating: 5 },
    { name: 'Lucas Oliveira', text: 'Barba e cabelo na régua. Virei cliente fiel.', rating: 5 },
];

export default function SocialProofWidget({ templateId, reviews }: SocialProofWidgetProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const activeReviews = reviews && reviews.length > 0 ? reviews : DEFAULT_REVIEWS;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % activeReviews.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [activeReviews.length]);

    const getStyles = () => {
        switch (templateId) {
            case 'classic':
                return 'bg-[#0a0a0a] border border-[#d4af37] text-[#d4af37]';
            case 'urban':
                return 'bg-[#ffff00] border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
            case 'modern':
            default:
                return 'bg-white/80 backdrop-blur-md border border-white/20 text-slate-800 shadow-lg';
        }
    };

    return (
        <div className="fixed bottom-24 left-6 z-40 max-w-xs md:max-w-sm">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className={`p-4 rounded-xl ${getStyles()} flex gap-3 items-start`}
                >
                    <div className={`p-2 rounded-full ${templateId === 'urban' ? 'bg-black text-[#ffff00]' : 'bg-current/10'}`}>
                        <Quote size={16} className="fill-current" />
                    </div>
                    <div>
                        <div className="flex gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className="fill-current text-current" />
                            ))}
                        </div>
                        <p className="text-sm font-medium mb-2 leading-snug">
                            "{activeReviews[currentIndex].text}"
                        </p>
                        <div className="flex items-center gap-2 text-xs opacity-80 font-bold uppercase tracking-wider">
                            <User size={12} />
                            {activeReviews[currentIndex].name}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
