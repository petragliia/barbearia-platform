'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuVariants: Variants = {
        closed: {
            opacity: 0,
            x: '100%',
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 40
            }
        }
    };

    const linkVariants = {
        closed: { opacity: 0, y: 20 },
        open: (delay: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: delay * 0.1,
                duration: 0.5
            }
        })
    };

    return (
        <div className="md:hidden">
            <button
                onClick={toggleMenu}
                className="p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Abrir menu"
            >
                <Menu size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-50 shadow-2xl p-6 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-xl font-bold text-slate-900">Menu</span>
                                <button
                                    onClick={toggleMenu}
                                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-6 flex-grow">
                                <motion.div custom={1} variants={linkVariants} initial="closed" animate="open">
                                    <Link
                                        href="#features"
                                        onClick={toggleMenu}
                                        className="text-lg font-medium text-slate-600 hover:text-blue-600 flex items-center justify-between"
                                    >
                                        Funcionalidades
                                    </Link>
                                </motion.div>

                                <motion.div custom={2} variants={linkVariants} initial="closed" animate="open">
                                    <Link
                                        href="#templates"
                                        onClick={toggleMenu}
                                        className="text-lg font-medium text-slate-600 hover:text-blue-600 flex items-center justify-between"
                                    >
                                        Modelos
                                    </Link>
                                </motion.div>

                                <motion.div custom={3} variants={linkVariants} initial="closed" animate="open">
                                    <Link
                                        href="#pricing"
                                        onClick={toggleMenu}
                                        className="text-lg font-medium text-slate-600 hover:text-blue-600 flex items-center justify-between"
                                    >
                                        Preços
                                    </Link>
                                </motion.div>

                                <hr className="border-slate-100 my-2" />

                                <motion.div custom={4} variants={linkVariants} initial="closed" animate="open">
                                    <Link
                                        href="/login"
                                        className="text-lg font-medium text-slate-600 hover:text-blue-600 block"
                                    >
                                        Entrar
                                    </Link>
                                </motion.div>
                            </nav>

                            <motion.div
                                custom={5}
                                variants={linkVariants}
                                initial="closed"
                                animate="open"
                                className="mt-auto"
                            >
                                <Link href="/register" onClick={toggleMenu}>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-lg shadow-lg shadow-blue-600/20">
                                        Começar Grátis <ArrowRight size={20} className="ml-2" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
