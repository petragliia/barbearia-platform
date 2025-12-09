'use client';

import { Review } from '@/features/reviews/types';
import { Star, User, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReviewsSectionProps {
    reviews: Review[];
    templateId: string;
}

export default function ReviewsSection({ reviews, templateId }: ReviewsSectionProps) {
    if (!reviews || reviews.length === 0) return null;

    const getStyles = () => {
        switch (templateId) {
            case 'classic':
                return {
                    section: 'bg-[#0f0f0f] py-20',
                    card: 'bg-[#1a1a1a] border border-[#d4af37]/20',
                    text: 'text-gray-300',
                    name: 'text-[#d4af37]',
                    star: 'text-[#d4af37]',
                    heading: 'text-[#d4af37] font-serif'
                };
            case 'urban':
                return {
                    section: 'bg-zinc-900 py-20',
                    card: 'bg-zinc-800 border-2 border-black shadow-[4px_4px_0px_0px_#ffff00]',
                    text: 'text-white',
                    name: 'text-[#ffff00] uppercase tracking-wider font-black',
                    star: 'text-[#ffff00]',
                    heading: 'text-white uppercase tracking-tighter'
                };
            case 'modern':
            default:
                return {
                    section: 'bg-slate-50 py-20',
                    card: 'bg-white shadow-sm border border-slate-100',
                    text: 'text-slate-600',
                    name: 'text-slate-900 font-semibold',
                    star: 'text-yellow-400',
                    heading: 'text-slate-900'
                };
        }
    };

    const styles = getStyles();

    return (
        <section className={styles.section}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${styles.heading}`}>
                        O que dizem nossos clientes
                    </h2>
                    <div className="w-20 h-1 bg-current mx-auto opacity-20" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-6 rounded-xl relative ${styles.card}`}
                        >
                            <Quote size={24} className={`absolute top-6 right-6 opacity-10 ${styles.star}`} />

                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={`${i < review.rating ? styles.star : 'text-gray-300/20'} fill-current`}
                                    />
                                ))}
                            </div>

                            <p className={`mb-6 leading-relaxed ${styles.text}`}>
                                "{review.text}"
                            </p>

                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${templateId === 'urban' ? 'bg-[#ffff00] text-black' : 'bg-gray-200 text-gray-500'}`}>
                                    {review.avatar ? (
                                        <img src={review.avatar} alt={review.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <div>
                                    <p className={`text-sm ${styles.name}`}>{review.name}</p>
                                    {review.date && (
                                        <p className="text-xs opacity-50">{review.date}</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
