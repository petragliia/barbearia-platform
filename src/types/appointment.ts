export interface Appointment {
    id: string;
    barbershopId: string;
    customerName: string;
    customerPhone: string;
    serviceName: string;
    price: number;
    date: any; // Timestamp from Firestore
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: any;
    barberId: string;
    barberName: string;
}
