'use client';

import { useDemoStore } from '@/store/useDemoStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, MapPin, Calendar, Star, X, Check, Palette } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import ThemeEditor from '@/features/customization/components/ThemeEditor';

interface DemoCustomizerProps {
    colors: any;
    onUpdate: (colors: any) => void;
}

export default function DemoCustomizer({ colors, onUpdate }: DemoCustomizerProps) {
    const {
        showBooking, toggleBooking,
        showMap, toggleMap,
        showReviews, toggleReviews
    } = useDemoStore();

    const [isThemeOpen, setIsThemeOpen] = useState(false);

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-4">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-full p-2 flex items-center gap-2 shadow-2xl"
            >
                <div className="flex items-center gap-1 px-2 border-r border-white/10 mr-1">
                    <Settings2 size={16} className="text-white/50" />
                    <span className="text-xs font-medium text-white/50 uppercase tracking-wider hidden md:block">Personalizar</span>
                </div>

                <ToggleBtn
                    active={isThemeOpen}
                    onClick={() => setIsThemeOpen(!isThemeOpen)}
                    icon={Palette}
                    label="Cores"
                    highlight
                />

                <div className="w-[1px] h-6 bg-white/10 mx-1" />

                <ToggleBtn
                    active={showBooking}
                    onClick={toggleBooking}
                    icon={Calendar}
                    label="Agendamento"
                />

                <ToggleBtn
                    active={showMap}
                    onClick={toggleMap}
                    icon={MapPin}
                    label="Mapa"
                />

                <ToggleBtn
                    active={showReviews}
                    onClick={toggleReviews}
                    icon={Star}
                    label="Avaliações"
                    highlight
                />
            </motion.div>

            <AnimatePresence>
                {isThemeOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    >
                        <ThemeEditor colors={colors} onUpdate={onUpdate} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ToggleBtn({ active, onClick, icon: Icon, label, highlight }: any) {
    return (
        <button
            onClick={onClick}
            className={`
                relative px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300
                ${active
                    ? highlight
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                        : 'bg-white text-black'
                    : 'bg-transparent text-white/50 hover:bg-white/5'
                }
            `}
        >
            <Icon size={16} className={active && highlight ? 'fill-white' : ''} />
            <span className="text-sm font-medium">{label}</span>
            {active && (
                <motion.div layoutId="active-dot" className="w-1.5 h-1.5 rounded-full bg-current ml-1" />
            )}
        </button>
    );
}
