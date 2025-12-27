
export interface OrderItem {
    id: string; // Product ID
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    barberId: string;
    customerEmail: string;
    customerName: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'paid' | 'failed';
    stripeSessionId: string;
    createdAt: Date;
}
