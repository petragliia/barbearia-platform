'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ChevronsLeftRight, ChevronsRight, ChevronsLeft } from 'lucide-react';

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    className?: string;
}

export default function BeforeAfterSlider({ beforeImage, afterImage, className = '' }: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        setSliderPosition((x / rect.width) * 100);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
        setSliderPosition((x / rect.width) * 100);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    const handleTouchStart = () => setIsDragging(true);
    const handleTouchEnd = () => setIsDragging(false);

    // Stop dragging if mouse leaves the container
    const handleMouseLeave = () => setIsDragging(false);

    return (
        <div
            ref={containerRef}
            className={`relative w-full aspect-[4/5] md:aspect-video overflow-hidden rounded-xl cursor-ew-resize select-none ${className}`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Background Image (After) */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={afterImage}
                    alt="After"
                    className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold tracking-widest uppercase">
                    Depois
                </div>
            </div>

            {/* Foreground Image (Before) - Clipped */}
            <div
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={beforeImage}
                    alt="Before"
                    className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold tracking-widest uppercase">
                    Antes
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-black">
                    <ChevronsLeftRight size={20} />
                </div>
            </div>
        </div>
    );
}
