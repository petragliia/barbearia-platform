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
                y: -10,
                scale: 1.02,
                boxShadow: "0 20px 50px rgba(234, 179, 8, 0.2)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={onClick}
            className={clsx(
                "relative flex flex-col md:flex-row justify-between items-end p-6 bg-[#0a0a0a] border border-[#d4af37]/30 rounded-lg cursor-pointer group overflow-hidden",
                isActive && "border-[#d4af37] bg-[#d4af37]/5"
            )}
        >
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="w-full md:w-auto relative z-10">
                <div className="text-2xl md:text-3xl font-bold text-[#f3e5ab] group-hover:text-[#d4af37] transition-colors font-serif">
                    {serviceName}
                </div>
                <div className="text-[#d4af37]/60 mt-2 font-sans text-sm tracking-wider uppercase flex items-center gap-2">
                    <Clock size={14} />
                    <span>{duration}</span>
                </div>
            </div>

            <div className="relative z-10 mt-4 md:mt-0">
                <div className="text-2xl md:text-3xl font-bold text-[#d4af37] flex items-center">
                    <span className="text-lg mr-1 opacity-70">R$</span>
                    {price}
                </div>
            </div>
        </motion.div>
    );
}
