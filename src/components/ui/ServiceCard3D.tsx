
'use client';

import Tilt from 'react-parallax-tilt';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { ReactNode } from 'react';

interface ServiceCard3DProps {
    serviceName: ReactNode;
    price: ReactNode;
    duration: ReactNode;
    onClick?: () => void;
    isActive?: boolean;
}

export default function ServiceCard3D({ serviceName, price, duration, onClick, isActive }: ServiceCard3DProps) {
    return (
        <Tilt
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            scale={1.05}
            glareEnable={true}
            glareMaxOpacity={0.3}
            className="h-full"
        >
            <div
                onClick={onClick}
                className={cn(
                    "h-full p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 group relative overflow-hidden",
                    "bg-zinc-900 border border-zinc-800 rounded-xl",
                    "hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]",
                    isActive && "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                )}
            >
                {/* Content */}
                <div className="relative z-10">
                    <div className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {serviceName}
                    </div>

                    <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                        <Clock size={14} />
                        <span>{duration}</span>
                    </div>
                </div>

                {/* Price - Neon/Gold Highlight */}
                <div className="relative z-10 mt-auto">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 group-hover:from-yellow-400 group-hover:to-orange-500 transition-all duration-300 flex items-center gap-1">
                        R$ {price}
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
            </div>
        </Tilt>
    );
}
