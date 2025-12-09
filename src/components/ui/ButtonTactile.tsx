'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface ButtonTactileProps {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    fullWidth?: boolean;
}

export default function ButtonTactile({ children, onClick, disabled, className, fullWidth }: ButtonTactileProps) {
    return (
        <motion.button
            whileHover={{
                x: disabled ? 0 : -2,
                y: disabled ? 0 : -2,
                boxShadow: disabled ? "none" : "8px 8px 0px #000"
            }}
            whileTap={{
                x: 0,
                y: 0,
                boxShadow: "0px 0px 0px #000"
            }}
            initial={{ boxShadow: "5px 5px 0px #000" }}
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                "bg-[#FACC15] text-black font-black uppercase tracking-wider border-2 border-black transition-all duration-75 active:translate-x-[5px] active:translate-y-[5px]",
                fullWidth ? "w-full" : "w-auto",
                disabled && "opacity-50 cursor-not-allowed grayscale",
                className
            )}
        >
            {children}
        </motion.button>
    );
}
