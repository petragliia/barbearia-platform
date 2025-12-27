'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface ServiceCardClassicProps {
    serviceName: ReactNode;
    price: ReactNode;
    duration: ReactNode;
    onClick?: () => void;
    isActive?: boolean;
}

export default function ServiceCardClassic({ serviceName, price, duration, onClick, isActive }: ServiceCardClassicProps) {
    return (
        <motion.div
            whileHover={{
                scale: 1.02,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={onClick}
            className={clsx(
                "relative flex justify-between items-center p-6 border-b border-dashed border-classic-gold/20 cursor-pointer group transition-all duration-300",
                "bg-transparent hover:bg-classic-gold/5",
                isActive && "bg-classic-gold/10"
            )}
        >
            <div className="flex-1 pr-2 md:pr-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between w-full relative">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-classic-cream group-hover:text-classic-gold transition-colors font-serif z-10 bg-classic-bg pr-4 mb-1 sm:mb-0">
                        {serviceName}
                    </div>
                    {/* Dots leader - Hidden on mobile, visible on sm+ */}
                    <div className="hidden sm:block absolute bottom-1 left-0 w-full border-b-2 border-dotted border-classic-gold/20 -z-0"></div>

                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-classic-gold z-10 bg-classic-bg sm:pl-4 flex-shrink-0 self-end sm:self-auto">
                        <span className="text-sm mr-1 opacity-70 align-top">R$</span>
                        {price}
                    </div>
                </div>

                <div className="text-classic-gold/60 mt-1 sm:mt-2 font-sans text-[10px] sm:text-xs tracking-[0.1em] uppercase flex items-center gap-2">
                    <Clock size={12} />
                    <span>{duration}</span>
                </div>
            </div>
        </motion.div>
    );
}
