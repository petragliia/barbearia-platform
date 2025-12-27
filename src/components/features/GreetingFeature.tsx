'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Send } from 'lucide-react';
import { clsx } from 'clsx';

export default function GreetingFeature() {
    const [name, setName] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const storedName = localStorage.getItem('user_name');
        console.log('GreetingFeature: storedName', storedName);

        if (storedName) {
            setName(storedName);
        } else {
            console.log('GreetingFeature: Opening modal');
            // Remove delay to test visibility immediately
            setIsOpen(true);
        }
        setHasLoaded(true);
    }, []);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (inputValue.trim()) {
            setName(inputValue.trim());
            localStorage.setItem('user_name', inputValue.trim());
            setIsOpen(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleLogout = () => {
        setName(null);
        localStorage.removeItem('user_name');
        setIsOpen(true); // Re-open modal immediately on logout
    };

    if (!hasLoaded) return null;

    return (
        <>
            {/* Modal */}
            <AnimatePresence>
                {isOpen && !name && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl shadow-blue-900/10 relative w-full max-w-sm overflow-hidden z-[10000]"
                        >
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2"
                            >
                                <X size={18} />
                            </button>

                            <div className="text-center mb-6 mt-2">
                                <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-500 shadow-sm border border-blue-500/20">
                                    <User size={32} />
                                </div>
                                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Bem-vindo!</h2>
                                <p className="text-slate-400 font-medium text-sm">Como você gostaria de ser chamado?</p>
                            </div>

                            <form onSubmit={handleSubmit} className="relative space-y-4">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Digite seu nome..."
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none px-6 py-4 rounded-xl text-lg text-center font-bold text-white placeholder-slate-600 transition-all"
                                    autoFocus
                                />
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className={clsx(
                                        "w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2",
                                        inputValue.trim()
                                            ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 cursor-pointer"
                                            : "bg-slate-800 text-slate-500 cursor-default"
                                    )}
                                    disabled={!inputValue.trim()}
                                >
                                    <span>Continuar</span>
                                    {inputValue.trim() && <Send size={18} />}
                                </motion.button>
                            </form>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={handleClose}
                                    className="text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wide"
                                >
                                    Pular por enquanto
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Top Right Display */}
            <AnimatePresence>
                {name && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed top-24 right-6 z-[9999] pointer-events-auto"
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/20 px-5 py-2.5 rounded-full flex items-center gap-3 cursor-pointer group"
                            onClick={handleLogout}
                            title="Clique para sair"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-600/20">
                                {name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-300 pr-2 text-sm">
                                Olá, <span className="font-bold text-blue-400">{name}</span>!
                            </span>

                            <div className="w-0 overflow-hidden group-hover:w-auto transition-all duration-300">
                                <span className="text-xs text-red-400 font-bold whitespace-nowrap ml-2">Sair</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
