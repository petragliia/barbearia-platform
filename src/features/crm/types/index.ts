
import { Appointment } from '@/types/appointment';

export interface Client {
    id: string; // generated from phone number usually
    name: string;
    phone: string;
    totalVisits: number;
    totalSpend: number;
    lastVisit: Date;
    firstVisit: Date;
    averageTicket: number;
    status: 'active' | 'churned' | 'new'; // driven by lastVisit date
    history: Appointment[];
}

export type SortField = 'name' | 'totalVisits' | 'totalSpend' | 'lastVisit';
export type SortOrder = 'asc' | 'desc';
