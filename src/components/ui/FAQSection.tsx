'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import EditableText from '@/components/ui/EditableText';
import { FAQItem } from '@/types/barbershop';

interface FAQSectionProps {
    faq: FAQItem[];
    isEditing?: boolean;
    onUpdate?: (index: number, field: 'question' | 'answer', value: string) => void;
    onAdd?: () => void;
    onRemove?: (index: number) => void;
}

export default function FAQSection({ faq, isEditing, onUpdate, onAdd, onRemove }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#d4af37] font-serif">Perguntas Frequentes</h2>
                    <div className="flex justify-center items-center gap-4">
                        <div className="h-[1px] w-20 bg-[#d4af37]/50"></div>
                        <HelpCircle size={24} className="text-[#d4af37]" />
                        <div className="h-[1px] w-20 bg-[#d4af37]/50"></div>
                    </div>
                </motion.div>

                <div className="space-y-4">
                    {faq.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="border border-[#d4af37]/20 rounded-lg overflow-hidden bg-[#111]"
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#d4af37]/5 transition-colors"
                            >
                                <EditableText
                                    as="span"
                                    isEditing={!!isEditing}
                                    value={item.question}
                                    onChange={(val) => onUpdate?.(index, 'question', val)}
                                    className="text-lg font-medium text-[#f3e5ab]"
                                />
                                <span className="text-[#d4af37] ml-4">
                                    {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 pt-2 text-gray-400 border-t border-[#d4af37]/10">
                                            <EditableText
                                                as="p"
                                                isEditing={!!isEditing}
                                                value={item.answer}
                                                onChange={(val) => onUpdate?.(index, 'answer', val)}
                                            />
                                            {isEditing && onRemove && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRemove(index);
                                                    }}
                                                    className="mt-4 text-xs text-red-500 hover:text-red-400 uppercase tracking-wider"
                                                >
                                                    Remover Pergunta
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}

                    {isEditing && onAdd && (
                        <button
                            onClick={onAdd}
                            className="w-full py-4 border-2 border-dashed border-[#d4af37]/30 rounded-lg text-[#d4af37]/50 hover:text-[#d4af37] hover:border-[#d4af37] transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={20} />
                            <span>Adicionar Pergunta</span>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
