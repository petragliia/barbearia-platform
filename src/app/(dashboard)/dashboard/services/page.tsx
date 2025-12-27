'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, X, Save, Clock, DollarSign } from 'lucide-react';
import { BarbershopData, Service } from '@/types/barbershop';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServicesPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState<Service[]>([]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    // Allow price to be string | number to handle empty input state elegantly
    const [formData, setFormData] = useState<{ name: string; price: string | number; duration: string }>({ name: '', price: '', duration: '30 min' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'barbershops', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as BarbershopData;
                    setServices(data.services || []);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [user]);

    const handleOpenModal = (index?: number) => {
        if (index !== undefined) {
            setEditingIndex(index);
            setFormData(services[index]);
        } else {
            setEditingIndex(null);
            setFormData({ name: '', price: '', duration: '30 min' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);

        try {
            const priceValue = typeof formData.price === 'string'
                ? parseFloat(formData.price.replace(',', '.')) || 0
                : formData.price;

            const serviceToSave: Service = {
                name: formData.name,
                price: priceValue,
                duration: formData.duration
            };

            const newServices = [...services];
            if (editingIndex !== null) {
                newServices[editingIndex] = serviceToSave;
            } else {
                newServices.push(serviceToSave);
            }

            const docRef = doc(db, 'barbershops', user.uid);
            await updateDoc(docRef, { services: newServices });

            setServices(newServices);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving service:", error);
            alert("Erro ao salvar serviço.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (index: number) => {
        if (!user || !confirm('Tem certeza que deseja excluir este serviço?')) return;

        try {
            const newServices = services.filter((_, i) => i !== index);
            const docRef = doc(db, 'barbershops', user.uid);
            await updateDoc(docRef, { services: newServices });
            setServices(newServices);
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Erro ao excluir serviço.");
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Carregando...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Serviços</h1>
                    <p className="text-slate-400">Gerencie os serviços oferecidos na sua barbearia.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20">
                    <Plus size={18} className="mr-2" />
                    Novo Serviço
                </Button>
            </div>

            <div className="grid gap-4">
                {services.length === 0 ? (
                    <div className="text-center py-12 bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
                        Nenhum serviço cadastrado.
                    </div>
                ) : (
                    services.map((service, index) => (
                        <div key={index} className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors shadow-sm">
                            <div>
                                <h3 className="font-bold text-lg text-slate-100">{service.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                                    <span className="flex items-center gap-1"><Clock size={14} /> {service.duration}</span>
                                    <span className="flex items-center gap-1"><DollarSign size={14} /> R$ {service.price.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(index)} className="text-slate-400 hover:text-slate-100 hover:bg-slate-800">
                                    <Pencil size={18} />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(index)} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-slate-900 w-full max-w-md rounded-xl shadow-2xl pointer-events-auto border border-slate-800 overflow-hidden">
                                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                                    <h3 className="font-bold text-lg text-slate-100">{editingIndex !== null ? 'Editar Serviço' : 'Novo Serviço'}</h3>
                                    <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-100 hover:bg-slate-800">
                                        <X size={20} />
                                    </Button>
                                </div>
                                <div className="p-6 space-y-4 bg-slate-900">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Nome do Serviço</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-600 transition-all"
                                            placeholder="Ex: Corte de Cabelo"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Preço (R$)</label>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Duração</label>
                                            <input
                                                type="text"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-600 transition-all"
                                                placeholder="Ex: 30 min"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-slate-800 flex justify-end gap-2 bg-slate-900">
                                    <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200 hover:bg-slate-800">Cancelar</Button>
                                    <Button onClick={handleSave} disabled={saving || !formData.name} className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20">
                                        {saving ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
