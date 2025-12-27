import { useState } from 'react';
import { Service } from '@/types/barbershop';
import { Product } from '@/features/products/types';

interface BookingData {
    name: string;
    phone: string;
    date: Date;
    time: string;
    services: Service[]; // Changed from single service to array
    barbershopId: string;
    barberId: string;
    barberName: string;
    products?: Product[];
}

export function useBooking() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAvailableSlots = async (date: Date, barbershopId: string, serviceDuration: string) => {
        setLoading(true);
        setError(null);

        // Mock for Demo
        if (barbershopId === 'demo') {
            setTimeout(() => setLoading(false), 500);
            return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
        }

        try {
            const duration = serviceDuration.replace(/\D/g, '') || '30';
            const res = await fetch(`/api/availability?date=${date.toISOString()}&barbershopId=${barbershopId}&serviceDuration=${duration}`);

            if (!res.ok) throw new Error('Failed to fetch slots');

            const data = await res.json();
            return data.slots as string[];
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createAppointment = async (data: BookingData) => {
        setLoading(true);
        setError(null);

        // Mock for Demo
        if (data.barbershopId === 'demo') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
            return { success: true, message: 'Agendamento de demonstração realizado!' };
        }

        try {
            // Combine date and time
            const [hours, minutes] = data.time.split(':').map(Number);
            const appointmentDate = new Date(data.date);
            appointmentDate.setHours(hours, minutes, 0, 0);

            // Calculate totals
            const totalDuration = data.services.reduce((acc, s) => acc + parseInt(s.duration.replace(/\D/g, '') || '30'), 0);
            const totalPrice = data.services.reduce((acc, s) => acc + s.price, 0);
            const serviceNames = data.services.map(s => s.name).join(' + ');

            const payload = {
                barbershopId: data.barbershopId,
                serviceId: data.services.length === 1 ? data.services[0].name.toLowerCase().replace(/\s+/g, '-') : 'combo',
                serviceName: serviceNames,
                services: data.services, // Save full details if needed
                price: totalPrice,
                date: appointmentDate.toISOString(),
                duration: totalDuration,
                customerName: data.name,
                customerPhone: data.phone,
                barberId: data.barberId,
                barberName: data.barberName,
                products: data.products?.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.price
                })) || []
            };

            const res = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.status === 409) {
                throw new Error('Horário indisponível. Por favor, escolha outro.');
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Erro ao agendar. Tente novamente.');
            }

            return await res.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        fetchAvailableSlots,
        createAppointment,
        loading,
        error
    };
}
