'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Trash2, Plus, User, MessageSquare } from 'lucide-react';
import { Review } from '@/features/reviews/types';

interface ReviewsManagerProps {
    isOpen: boolean;
    onClose: () => void;
    reviews: Review[];
    onUpdate: (reviews: Review[]) => void;
}

export default function ReviewsManager({ isOpen, onClose, reviews, onUpdate }: ReviewsManagerProps) {
    const [newReview, setNewReview] = useState<Partial<Review>>({
        name: '',
        text: '',
        rating: 5
    });

    const handleAddReview = () => {
        if (!newReview.name || !newReview.text) return;

        const review: Review = {
            id: Math.random().toString(36).substr(2, 9),
            name: newReview.name,
            text: newReview.text,
            rating: newReview.rating || 5,
            date: new Date().toLocaleDateString('pt-BR'),
            avatar: newReview.avatar
        };

        onUpdate([...reviews, review]);
        setNewReview({ name: '', text: '', rating: 5 });
    };

    const handleDeleteReview = (id: string) => {
        onUpdate(reviews.filter(r => r.id !== id));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                    <MessageSquare size={20} />
                                    Gerenciar Avaliações
                                </h3>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                                {/* Add New Review Form */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Plus size={18} className="text-blue-600" />
                                        Adicionar Nova Avaliação
                                    </h4>
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Cliente</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    <input
                                                        type="text"
                                                        value={newReview.name}
                                                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="Ex: João Silva"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nota</label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                                            className={`p-2 rounded-lg transition-colors ${(newReview.rating || 0) >= star ? 'text-yellow-400 bg-yellow-50' : 'text-gray-300 bg-gray-50'
                                                                }`}
                                                        >
                                                            <Star size={20} fill="currentColor" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Depoimento</label>
                                            <textarea
                                                value={newReview.text}
                                                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                                                className="w-full p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                                                placeholder="O que o cliente disse..."
                                            />
                                        </div>
                                        <button
                                            onClick={handleAddReview}
                                            disabled={!newReview.name || !newReview.text}
                                            className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Adicionar Avaliação
                                        </button>
                                    </div>
                                </div>

                                {/* List Reviews */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-800 mb-2">Avaliações Atuais ({reviews.length})</h4>
                                    {reviews.length === 0 ? (
                                        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                                            <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                            <p>Nenhuma avaliação cadastrada ainda.</p>
                                        </div>
                                    ) : (
                                        reviews.map((review) => (
                                            <motion.div
                                                layout
                                                key={review.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 group"
                                            >
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 text-gray-500 font-bold">
                                                    {review.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div>
                                                            <h5 className="font-bold text-gray-900">{review.name}</h5>
                                                            <div className="flex gap-1 text-yellow-400 text-xs">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-200" : ""} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteReview(review.id)}
                                                            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <p className="text-gray-600 text-sm leading-relaxed">"{review.text}"</p>
                                                    {review.date && (
                                                        <p className="text-xs text-gray-400 mt-2">{review.date}</p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
