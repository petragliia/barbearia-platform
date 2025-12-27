import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp,
    Timestamp,
    doc,
    runTransaction
} from "firebase/firestore";
import { Order, OrderItem } from "../types";

const COLLECTION_NAME = "orders";

export const orderService = {
    /**
     * Creates a new order in Firestore.
     * Use this when you are NOT in a transaction.
     */
    createOrder: async (orderData: Omit<Order, "id" | "createdAt">): Promise<Order> => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...orderData,
                createdAt: serverTimestamp(),
            });

            return {
                id: docRef.id,
                ...orderData,
                createdAt: new Date(),
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
            const q = query(
                collection(db, COLLECTION_NAME),
                where("barberId", "==", barberId)
            );

            const querySnapshot = await getDocs(q);
            const orders: Order[] = [];

            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const createdAt = data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : new Date();

                orders.push({
                    id: docSnap.id,
                    barberId: data.barberId,
                    customerEmail: data.customerEmail,
                    customerName: data.customerName,
                    items: data.items,
                    total: data.total,
                    status: data.status,
                    stripeSessionId: data.stripeSessionId,
                    createdAt: createdAt,
                } as Order);
            });

            return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error) {
            console.error(`Error fetching orders for barber ${barberId}:`, error);
            throw new Error("Failed to fetch orders.");
        }
    }
};
