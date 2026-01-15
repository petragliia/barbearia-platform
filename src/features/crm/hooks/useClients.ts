
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Appointment } from '@/types/appointment';
import { Client } from '../types';

export function useClients() {
    const { user } = useAuth();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchAndAggregate = async () => {
            if (!user) return;
            try {
                // Fetch all appointments
                // Assuming appointments table has 'barbershop_id' snake_case
                const { data, error } = await supabase
                    .from('appointments')
                    .select('*')
                    .eq('barbershop_id', user.id) // Assuming user.uid maps to barbershopId (owner)
                    .order('date', { ascending: false });

                if (error) throw error;

                const appointments = (data || []).map(app => ({
                    ...app,
                    // Map snake_case to camelCase if needed, assuming appointment type matches
                    customerName: app.customer_name,
                    customerPhone: app.customer_phone,
                    // date: app.date is ISO string from Postgres
                })) as any[]; // Type assertion for now, ideally fix Appointment type

                // Aggregate by Phone
                const clientMap = new Map<string, Client>();

                appointments.forEach((app: any) => {
                    const phone = app.customerPhone;
                    if (!phone) return;

                    const date = new Date(app.date);

                    if (!clientMap.has(phone)) {
                        clientMap.set(phone, {
                            id: phone, // Simple ID for now
                            name: app.customerName,
                            phone: phone,
                            totalVisits: 0,
                            totalSpend: 0,
                            lastVisit: date,
                            firstVisit: date,
                            averageTicket: 0,
                            status: 'new',
                            history: []
                        });
                    }

                    const client = clientMap.get(phone)!;

                    // Update client data
                    client.history.push(app);

                    if (app.status === 'confirmed' || app.status === 'completed') { // checking completed as well
                        client.totalVisits += 1;
                        client.totalSpend += app.price;
                    }

                    // Update dates
                    if (date > client.lastVisit) client.lastVisit = date;
                    if (date < client.firstVisit) client.firstVisit = date;

                    // Update name if most recent appointment has a different name (maybe they fixed a typo)
                    // We stick to the first found (most recent due to sort) for now, or could logic this better.
                });

                // Final calculations
                const aggregatedClients = Array.from(clientMap.values()).map(client => {
                    client.averageTicket = client.totalVisits > 0 ? client.totalSpend / client.totalVisits : 0;

                    // Determine status
                    const daysSinceLastVisit = (new Date().getTime() - client.lastVisit.getTime()) / (1000 * 3600 * 24);
                    if (client.totalVisits === 1 && daysSinceLastVisit < 30) client.status = 'new';
                    else if (daysSinceLastVisit > 60) client.status = 'churned';
                    else client.status = 'active';

                    return client;
                });

                setClients(aggregatedClients);

            } catch (error) {
                console.error("Error fetching clients:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAndAggregate();
    }, [user, supabase]);

    return { clients, loading };
}
