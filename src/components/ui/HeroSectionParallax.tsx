'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import EditableText from '@/components/ui/EditableText';
import ImageUploader from '@/components/ui/ImageUploader';

interface HeroSectionParallaxProps {
    name: string;
    description: string;
    heroImage: string;
    isEditing: boolean;
    onUpdate: (field: string, value: any) => void;
    onBooking: () => void;
    enableParallax?: boolean;
}

export default function HeroSectionParallax({
    name,
    description,
    heroImage,
    isEditing,
    onUpdate,
    onBooking,
    enableParallax = true
}: HeroSectionParallaxProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Refined Parallax Speeds: Background moves slower (20%), Foreground moves faster (100% relative to scroll)
    // If enableParallax is false, we set the range to ["0%", "0%"] to disable movement
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", enableParallax ? "20%" : "0%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", enableParallax ? "50%" : "0%"]);

    return (
        <div ref={ref} className="relative h-screen overflow-hidden flex items-center justify-center bg-black">
            {/* Parallax Background */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 z-0 will-change-transform"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 z-10" />
                <img
                    src={heroImage}
                    alt="Hero Background"
                    className="w-full h-[120%] object-cover opacity-80"
                />
                {isEditing && (
                    <div className="absolute inset-0 z-20">
                        <ImageUploader onUpload={(url) => onUpdate('hero_image', url)} />
                    </div>
                )}
            </motion.div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-6 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ y: textY }}
                    className="will-change-transform"
                >
                    <div className="mb-6 flex justify-center">
                        <div className="w-24 h-1 bg-[#d4af37]" />
                    </div>

                    <div className="relative inline-block mb-6">
                        <EditableText
                            as="h1"
                            isEditing={isEditing}
                            value={name}
                            onChange={(val) => onUpdate('name', val)}
                            className="text-6xl md:text-8xl font-serif font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-200 to-yellow-600 bg-[length:200%_auto] animate-shine"
                        />
                    </div>

                    <EditableText
                        as="p"
                        isEditing={isEditing}
                        value={description}
                        onChange={(val) => onUpdate('description', val)}
                        className="text-xl md:text-2xl font-light tracking-widest uppercase mb-12 max-w-3xl mx-auto text-gray-200"
                    />

                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onBooking}
                        disabled={isEditing}
                        className={`
                            bg-[#d4af37] text-black px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] 
                            transition-all duration-300 border border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)]
                            ${isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                    >
                        Agendar Horário
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}
