import { createClient } from "@/lib/supabase/client";
import { Order, OrderItem } from "../types";

const TABLE_NAME = "orders";

export const orderService = {
    /**
     * Creates a new order in Supabase.
     */
    createOrder: async (orderData: Omit<Order, "id" | "createdAt">): Promise<Order> => {
        try {
            const supabase = createClient();

            const newOrder = {
                ...orderData,
                barber_id: orderData.barberId,
                customer_email: orderData.customerEmail,
                customer_name: orderData.customerName,
                stripe_session_id: orderData.stripeSessionId,
                items: orderData.items, // JSONB
                created_at: new Date().toISOString(),
            };

            // Remove camelCase keys
            delete (newOrder as any).barberId;
            delete (newOrder as any).customerEmail;
            delete (newOrder as any).customerName;
            delete (newOrder as any).stripeSessionId;

            const { data, error } = await supabase
                .from(TABLE_NAME)
                .insert([newOrder])
                .select()
                .single();

            if (error) throw error;

            return {
                id: data.id,
                ...orderData,
                createdAt: new Date(data.created_at),
            };
        } catch (error) {
            console.error("Error creating order:", error);
            throw new Error("Failed to create order.");
        }
    },

    /**
     * Gets orders for a specific barber.
     */
    getOrdersByBarber: async (barberId: string): Promise<Order[]> => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('barber_id', barberId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const orders: Order[] = (data || []).map(row => ({
                id: row.id,
                barberId: row.barber_id,
                customerEmail: row.customer_email,
                customerName: row.customer_name,
                items: row.items,
                total: row.total,
                status: row.status,
                stripeSessionId: row.stripe_session_id,
                createdAt: new Date(row.created_at)
            }));

            return orders;
        } catch (error) {
            console.error(`Error fetching orders for barber ${barberId}:`, error);
            throw new Error("Failed to fetch orders.");
        }
    }
};
