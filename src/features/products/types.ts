export interface Product {
    id: string;
    barberId: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    active: boolean;
    category: string; // Added validation for category
    createdAt: Date | string; // Flexibility for Firebase Timestamp or serialized string
}

export interface CartItem extends Product {
    quantity: number;
}
