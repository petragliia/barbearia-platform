'use client'; // Rebuild

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Check, ChevronRight, ChevronLeft, User, ShoppingBag } from 'lucide-react';
import { Service } from '@/types/barbershop';
import { useBooking } from '@/features/booking/hooks/useBooking';
import { useLoyalty } from '@/features/loyalty/hooks/useLoyalty';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Barber } from '@/features/team/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { clsx } from 'clsx';
import { Product } from '@/features/products/types';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    barbershopId: string;
    services: Service[];
    themeColor: string;
}

export default function BookingModal({ isOpen, onClose, barbershopId, services, themeColor }: BookingModalProps) {
    const [step, setStep] = useState(1);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [barbers, setBarbers] = useState<Barber[]>([]);

    // Products State
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    const [success, setSuccess] = useState(false);
    const { createAppointment, fetchAvailableSlots, loading } = useBooking();
    const { addPoints } = useLoyalty(barbershopId);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSuccess(false);
            setSelectedServices([]);
            setSelectedBarber(null);
            setSelectedDate(undefined);
            setSelectedTime(null);
            setCustomerName('');
            setCustomerPhone('');
            setSelectedProducts([]);

            const fetchBarbers = async () => {
                const q = query(collection(db, 'barbershops', barbershopId, 'professionals'), where('active', '==', true));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Barber[];
                setBarbers(data);
            };
            fetchBarbers();

            const fetchProducts = async () => {
                const q = query(collection(db, 'products'), where('barbershopId', '==', barbershopId), where('active', '==', true));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
                setProducts(data);
            };
            fetchProducts();
        }
    }, [isOpen, barbershopId]);

    // Fetch times when date is selected
    useEffect(() => {
        if (selectedDate && selectedServices.length > 0) {
            const totalDuration = selectedServices.reduce((acc, s) => acc + parseInt(s.duration.replace(/\D/g, '') || '30'), 0);
            setIsLoadingSlots(true);
            fetchAvailableSlots(selectedDate, barbershopId, totalDuration.toString())
                .then(setAvailableTimes)
                .finally(() => setIsLoadingSlots(false));
            setSelectedTime(null);
        }
    }, [selectedDate, selectedServices, barbershopId]); // eslint-disable-line

    const toggleProduct = (product: Product) => {
        setSelectedProducts(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) return prev.filter(p => p.id !== product.id);
            return [...prev, product];
        });
    };

    const toggleService = (service: Service) => {
        setSelectedServices(prev => {
            const exists = prev.find(s => s.name === service.name);
            if (exists) return prev.filter(s => s.name !== service.name);
            return [...prev, service];
        });
    };

    const handleNext = () => {
        if (step === 1 && selectedServices.length > 0) setStep(2);
        if (step === 2 && selectedBarber) setStep(3);
        if (step === 3 && selectedDate && selectedTime) {
            if (products.length === 0) setStep(5);
            else setStep(4);
        }
        if (step === 4) setStep(5);
    };

    const handleBack = () => {
        if (step > 1) {
            if (step === 5 && products.length === 0) setStep(3);
            else setStep(step - 1);
        }
    };

    const handleConfirm = async () => {
        if (selectedServices.length === 0 || !selectedBarber || !selectedDate || !selectedTime || !customerName || !customerPhone) return;

        try {
            await createAppointment({
                barbershopId,
                services: selectedServices,
                date: selectedDate,
                time: selectedTime,
                name: customerName,
                phone: customerPhone,
                barberId: selectedBarber.id,
                barberName: selectedBarber.name,
                products: selectedProducts
            });

            try {
                // Loyalty: Add point per service or just 1? Assuming 1 per visit, but code was adding 1.
                // Optionally add point per service: await addPoints(selectedServices.length, ...)
                // Let's keep it simple: 1 visit = 1 point, or maybe 1 point.
                await addPoints(1, `Agendamento: ${selectedServices.map(s => s.name).join(', ')}`);
            } catch {
                console.log("Loyalty points skipped");
            }

            setSuccess(true);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Erro ao agendar');
        }
    };

    const servicesTotal = selectedServices.reduce((acc, s) => acc + s.price, 0);
    const totalPrice = servicesTotal + selectedProducts.reduce((acc, p) => acc + p.price, 0);

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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">

                            {/* Header */}
                            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900 sticky top-0 z-10">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                    {success ? 'Agendamento Confirmado' : 'Agendar Horário'}
                                </h3>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto flex-1">
                                {success ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4"
                                        >
                                            <Check size={40} strokeWidth={3} />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tudo Certo!</h2>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Seu agendamento foi realizado com sucesso.
                                            <br />
                                            Te esperamos dia {selectedDate && format(selectedDate, "dd 'de' MMMM", { locale: ptBR })} às {selectedTime}.
                                        </p>
                                        <button
                                            onClick={onClose}
                                            className="mt-6 px-8 py-3 rounded-xl font-bold text-white transition-transform hover:scale-105"
                                            style={{ backgroundColor: themeColor }}
                                        >
                                            Fechar
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Progress Bar */}
                                        <div className="flex gap-2 mb-8">
                                            {[1, 2, 3, 4, 5].map((i) => {
                                                if (products.length === 0 && i === 4) return null; // Skip Upsell dot if no products
                                                if (products.length === 0 && i === 5) {
                                                    // Render step 5 as the 4th dot if no products
                                                    return (
                                                        <div
                                                            key={i}
                                                            className={clsx(
                                                                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                                                                5 <= step ? "bg-black dark:bg-white" : "bg-gray-200 dark:bg-zinc-800"
                                                            )}
                                                            style={{ backgroundColor: 5 <= step ? themeColor : undefined }}
                                                        />
                                                    )
                                                }
                                                const totalSteps = products.length > 0 ? 5 : 4;
                                                if (i > totalSteps) return null;

                                                let isActive = i <= step;
                                                // Correction if on step 5 but products length 0 (should correspond to 4th dot)
                                                if (products.length === 0 && step === 5) isActive = true;

                                                return (
                                                    <div
                                                        key={i}
                                                        className={clsx(
                                                            "h-1.5 flex-1 rounded-full transition-colors duration-300",
                                                            isActive ? "bg-black dark:bg-white" : "bg-gray-200 dark:bg-zinc-800"
                                                        )}
                                                        style={{ backgroundColor: isActive ? themeColor : undefined }}
                                                    />
                                                )
                                            })}
                                        </div>

                                        {/* Step 1: Services */}
                                        {step === 1 && (
                                            <div className="space-y-3">
                                                <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-4">Selecione os serviços</h4>
                                                {services.map((service) => {
                                                    const isSelected = selectedServices.some(s => s.name === service.name);
                                                    return (
                                                        <button
                                                            key={service.name}
                                                            onClick={() => toggleService(service)}
                                                            className={clsx(
                                                                "w-full p-4 rounded-xl border text-left transition-all hover:border-gray-400 dark:hover:border-zinc-600 flex justify-between items-center group",
                                                                isSelected
                                                                    ? "border-2 border-black dark:border-white bg-gray-50 dark:bg-zinc-800/50"
                                                                    : "border-gray-200 dark:border-zinc-800"
                                                            )}
                                                            style={{ borderColor: isSelected ? themeColor : undefined }}
                                                        >
                                                            <div>
                                                                <p className="font-bold text-gray-900 dark:text-white">{service.name}</p>
                                                                <p className="text-sm text-gray-500">{service.duration}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-medium text-gray-900 dark:text-white">
                                                                    R$ {service.price.toFixed(2)}
                                                                </span>
                                                                {isSelected && (
                                                                    <div className="bg-black text-white rounded-full p-1" style={{ backgroundColor: themeColor }}>
                                                                        <Check size={14} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Step 2: Barber */}
                                        {step === 2 && (
                                            <div className="space-y-3">
                                                <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-4">Escolha o Profissional</h4>
                                                {barbers.map((barber) => (
                                                    <button
                                                        key={barber.id}
                                                        onClick={() => setSelectedBarber(barber)}
                                                        className={clsx(
                                                            "w-full p-4 rounded-xl border text-left transition-all hover:border-gray-400 dark:hover:border-zinc-600 flex items-center gap-4 group",
                                                            selectedBarber?.id === barber.id
                                                                ? "border-2 border-black dark:border-white bg-gray-50 dark:bg-zinc-800/50"
                                                                : "border-gray-200 dark:border-zinc-800"
                                                        )}
                                                        style={{ borderColor: selectedBarber?.id === barber.id ? themeColor : undefined }}
                                                    >
                                                        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                            {barber.photoUrl ? (
                                                                <img src={barber.photoUrl} alt={barber.name} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <User size={24} className="text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white">{barber.name}</p>
                                                            <p className="text-sm text-gray-500">{barber.specialty}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Step 3: Date */}
                                        {step === 3 && (
                                            <div className="space-y-6">
                                                <div className="flex justify-center">
                                                    <DayPicker
                                                        mode="single"
                                                        selected={selectedDate}
                                                        onSelect={setSelectedDate}
                                                        locale={ptBR}
                                                        disabled={{ before: new Date() }}
                                                        modifiersStyles={{
                                                            selected: { backgroundColor: themeColor, color: 'white' }
                                                        }}
                                                        className="border border-gray-200 dark:border-zinc-800 rounded-xl p-4"
                                                    />
                                                </div>

                                                {selectedDate && (
                                                    <div className="animate-in fade-in slide-in-from-top-4">
                                                        <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                                                            <Clock size={16} />
                                                            Horários disponíveis
                                                        </h4>
                                                        {isLoadingSlots ? (
                                                            <div className="grid grid-cols-4 gap-2">
                                                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                                                    <div key={i} className="h-10 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                                                                ))}
                                                            </div>
                                                        ) : availableTimes.length > 0 ? (
                                                            <div className="grid grid-cols-4 gap-2">
                                                                {availableTimes.map((time) => (
                                                                    <button
                                                                        key={time}
                                                                        onClick={() => setSelectedTime(time)}
                                                                        className={clsx(
                                                                            "py-2 px-3 rounded-lg text-sm font-medium transition-colors border",
                                                                            selectedTime === time
                                                                                ? "bg-black text-white border-transparent"
                                                                                : "border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 text-gray-700 dark:text-gray-300"
                                                                        )}
                                                                        style={{ backgroundColor: selectedTime === time ? themeColor : undefined }}
                                                                    >
                                                                        {time}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-gray-200 dark:border-zinc-700">
                                                                <p>Sem horários livres para este dia.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Step 4: Upsell (Products) */}
                                        {step === 4 && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">Algo mais?</h4>
                                                    <span className="text-sm text-gray-500">Adicione produtos ao seu agendamento</span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    {products.map(product => {
                                                        const isSelected = selectedProducts.find(p => p.id === product.id);
                                                        return (
                                                            <div
                                                                key={product.id}
                                                                onClick={() => toggleProduct(product)}
                                                                className={clsx(
                                                                    "border rounded-xl p-3 cursor-pointer transition-all hover:border-gray-400 dark:hover:border-zinc-600 relative overflow-hidden group",
                                                                    isSelected ? "border-2 border-black dark:border-white bg-gray-50 dark:bg-zinc-800" : "border-gray-200 dark:border-zinc-800"
                                                                )}
                                                                style={{ borderColor: isSelected ? themeColor : undefined }}
                                                            >
                                                                {isSelected && (
                                                                    <div className="absolute top-2 right-2 bg-black text-white rounded-full p-0.5" style={{ backgroundColor: themeColor }}>
                                                                        <Check size={12} />
                                                                    </div>
                                                                )}
                                                                <div className="h-24 bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                                                                    {product.imageUrl ? (
                                                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <ShoppingBag className="text-gray-400" />
                                                                    )}
                                                                </div>
                                                                <h5 className="font-bold text-sm text-gray-900 dark:text-white truncate">{product.name}</h5>
                                                                <p className="text-gray-500 text-sm">R$ {product.price.toFixed(2)}</p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 5: Review */}
                                        {step === 5 && (
                                            <div className="space-y-4">
                                                <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl space-y-3 mb-6">
                                                    <div className="space-y-2 border-b border-gray-200 dark:border-zinc-700 pb-3">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Serviços ({selectedServices.length})</span>
                                                            <div className="text-right">
                                                                {selectedServices.map(s => (
                                                                    <div key={s.name} className="font-medium text-gray-900 dark:text-white">
                                                                        {s.name}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Profissional</span>
                                                            <span className="font-medium text-gray-900 dark:text-white">{selectedBarber?.name}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Data e Hora</span>
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                                {selectedDate && format(selectedDate, "dd/MM", { locale: ptBR })} às {selectedTime}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {selectedProducts.length > 0 && (
                                                        <div className="space-y-2 border-b border-gray-200 dark:border-zinc-700 pb-3">
                                                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Produtos</span>
                                                            {selectedProducts.map(p => (
                                                                <div key={p.id} className="flex justify-between text-sm">
                                                                    <span className="text-gray-500">{p.name}</span>
                                                                    <span className="font-medium text-gray-900 dark:text-white">R$ {p.price.toFixed(2)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="flex justify-between text-base pt-1">
                                                        <span className="font-bold text-gray-900 dark:text-white">Total</span>
                                                        <span className="font-bold text-gray-900 dark:text-white text-lg">
                                                            R$ {totalPrice.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seu Nome</label>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                            <input
                                                                type="text"
                                                                value={customerName}
                                                                onChange={(e) => setCustomerName(e.target.value)}
                                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-offset-0 outline-none transition-all"
                                                                style={{ '--tw-ring-color': themeColor } as any}
                                                                placeholder="Ex: João Silva"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seu WhatsApp</label>
                                                        <input
                                                            type="tel"
                                                            value={customerPhone}
                                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-offset-0 outline-none transition-all"
                                                            style={{ '--tw-ring-color': themeColor } as any}
                                                            placeholder="(00) 00000-0000"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            {!success && (
                                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 flex justify-between">
                                    <button
                                        onClick={handleBack}
                                        disabled={step === 1}
                                        className={clsx(
                                            "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
                                            step === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-zinc-800"
                                        )}
                                    >
                                        <ChevronLeft size={18} />
                                        Voltar
                                    </button>

                                    {step < 5 ? (
                                        <button
                                            onClick={handleNext}
                                            disabled={
                                                (step === 1 && selectedServices.length === 0) ||
                                                (step === 2 && !selectedBarber) ||
                                                (step === 3 && (!selectedDate || !selectedTime))
                                            }
                                            className="px-6 py-2 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            style={{ backgroundColor: themeColor }}
                                        >
                                            {step === 3 && products.length === 0 ? 'Revisar' : (step === 4 ? 'Revisar' : 'Próximo')}
                                            <ChevronRight size={18} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleConfirm}
                                            disabled={loading || !customerName || !customerPhone}
                                            className="px-8 py-2 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                            style={{ backgroundColor: themeColor }}
                                        >
                                            {loading ? (
                                                <>
                                                    <Clock className="animate-spin" size={18} />
                                                    Confirmando...
                                                </>
                                            ) : (
                                                <>
                                                    Confirmar Agendamento
                                                    <Check size={18} />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
