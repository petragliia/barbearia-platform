import { format } from 'date-fns';

export async function getAvailableSlots(date: Date, barbershopId: string, serviceDuration: string): Promise<string[]> {
    try {
        // Convert "45 min" -> 45
        const duration = parseInt(serviceDuration.replace(/\D/g, '')) || 30;

        const params = new URLSearchParams({
            date: date.toISOString(),
            barbershopId,
            serviceDuration: duration.toString()
        });

        const response = await fetch(`/api/availability?${params.toString()}`);

        if (!response.ok) {
            throw new Error('Failed to fetch slots');
        }

        const data = await response.json();
        return data.slots || [];
    } catch (error) {
        console.error('Error fetching slots:', error);
        return [];
    }
}
