'use client';

import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Clock } from 'lucide-react';
import { ReactNode, MouseEvent } from 'react';
import { clsx } from 'clsx';

interface ServiceCardGlassProps {
    serviceName: ReactNode;
    price: ReactNode;
    duration: ReactNode;
    onClick?: () => void;
    isActive?: boolean;
}

export default function ServiceCardGlass({ serviceName, price, duration, onClick, isActive }: ServiceCardGlassProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            onClick={onClick}
            className={clsx(
                "group relative h-full rounded-2xl border border-gray-200 bg-white/50 px-8 py-10 shadow-xl backdrop-blur-xl cursor-pointer overflow-hidden hover:border-blue-500/30 transition-colors",
                isActive && "border-blue-500/50 bg-blue-50"
            )}
        >
            {/* Neon Glow Effect following mouse */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(59, 130, 246, 0.15),
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* Neon Circle Moving in Background */}
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl"
            />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {serviceName}
                    </h3>
                    <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm font-medium tracking-wide uppercase">
                        <Clock size={14} />
                        {duration}
                    </div>
                </div>

                <div className="mt-8">
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:from-blue-700 group-hover:to-cyan-600 transition-all duration-300">
                        <span className="text-lg mr-1 text-gray-400">R$</span>
                        {price}
                    </div>
                </div>
            </div>
        </div>
    );
}
