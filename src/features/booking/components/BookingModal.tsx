'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, Check, ChevronRight, ChevronLeft, User } from 'lucide-react';
import { Service } from '@/types/barbershop';
import { useBooking } from '@/features/booking/hooks/useBooking';
import { useLoyalty } from '@/features/loyalty/hooks/useLoyalty';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    barbershopId: string;
    services: Service[];
    themeColor: string; // Hex color for buttons/highlights
}

export default function BookingModal({ isOpen, onClose, barbershopId, services, themeColor }: BookingModalProps) {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    const [success, setSuccess] = useState(false);
    const { createAppointment, fetchAvailableSlots, loading, error } = useBooking();
    const { addPoints } = useLoyalty(barbershopId);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSuccess(false);
            setSelectedService(null);
            setSelectedDate(undefined);
            setSelectedTime(null);
            setCustomerName('');
            setCustomerPhone('');
        }
    }, [isOpen]);

    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Fetch times when date is selected
    useEffect(() => {
        if (selectedDate && selectedService) {
            setIsLoadingSlots(true);
            fetchAvailableSlots(selectedDate, barbershopId, selectedService.duration)
                .then(setAvailableTimes)
                .finally(() => setIsLoadingSlots(false));
            setSelectedTime(null);
        }
    }, [selectedDate, selectedService, barbershopId]);

    const handleNext = () => {
        if (step === 1 && selectedService) setStep(2);
        if (step === 2 && selectedDate && selectedTime) setStep(3);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleConfirm = async () => {
        if (!selectedService || !selectedDate || !selectedTime || !customerName || !customerPhone) return;

        try {
            await createAppointment({
                barbershopId,
                service: selectedService,
                date: selectedDate,
                time: selectedTime,
                name: customerName,
                phone: customerPhone,
            });

            // Add loyalty points (fire and forget for now)
            try {
                // Assuming 1 point per service for MVP
                await addPoints(1, `Agendamento: ${selectedService.name}`);
            } catch (ignore) {
                // If user not logged in or other error, just ignore for booking flow flow
                console.log("Loyalty points skipped");
            }

            setSuccess(true);
        } catch (err) {
            // Error is handled by useBooking hook state, but we can also show an alert
            // The hook sets 'error' state, we can display that or use the alert below
            alert(err instanceof Error ? err.message : 'Erro ao agendar');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
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
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className={clsx(
                                                        "h-1.5 flex-1 rounded-full transition-colors duration-300",
                                                        i <= step ? "bg-black dark:bg-white" : "bg-gray-200 dark:bg-zinc-800"
                                                    )}
                                                    style={{ backgroundColor: i <= step ? themeColor : undefined }}
                                                />
                                            ))}
                                        </div>

                                        {/* Step 1: Services */}
                                        {step === 1 && (
                                            <div className="space-y-3">
                                                <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-4">Selecione um serviço</h4>
                                                {services.map((service) => (
                                                    <button
                                                        key={service.name}
                                                        onClick={() => setSelectedService(service)}
                                                        className={clsx(
                                                            "w-full p-4 rounded-xl border text-left transition-all hover:border-gray-400 dark:hover:border-zinc-600 flex justify-between items-center group",
                                                            selectedService?.name === service.name
                                                                ? "border-2 border-black dark:border-white bg-gray-50 dark:bg-zinc-800/50"
                                                                : "border-gray-200 dark:border-zinc-800"
                                                        )}
                                                        style={{ borderColor: selectedService?.name === service.name ? themeColor : undefined }}
                                                    >
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white">{service.name}</p>
                                                            <p className="text-sm text-gray-500">{service.duration}</p>
                                                        </div>
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            R$ {service.price.toFixed(2)}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Step 2: Date & Time */}
                                        {step === 2 && (
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

                                        {/* Step 3: Info */}
                                        {step === 3 && (
                                            <div className="space-y-4">
                                                <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl space-y-2 mb-6">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Serviço</span>
                                                        <span className="font-medium text-gray-900 dark:text-white">{selectedService?.name}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Data e Hora</span>
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {selectedDate && format(selectedDate, "dd/MM", { locale: ptBR })} às {selectedTime}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Valor</span>
                                                        <span className="font-medium text-gray-900 dark:text-white">R$ {selectedService?.price.toFixed(2)}</span>
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

                                    {step < 3 ? (
                                        <button
                                            onClick={handleNext}
                                            disabled={(step === 1 && !selectedService) || (step === 2 && (!selectedDate || !selectedTime))}
                                            className="px-6 py-2 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            style={{ backgroundColor: themeColor }}
                                        >
                                            Próximo
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
