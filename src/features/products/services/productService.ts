import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    Timestamp,
    serverTimestamp
} from "firebase/firestore";
import { Product } from "../types";

const COLLECTION_NAME = "products";

export const productService = {
    /**
     * Creates a new product in Firestore.
     * @param productData Omit<Product, "id" | "createdAt">
     * @returns Promise<Product> The created product with generated ID.
     */
    createProduct: async (productData: Omit<Product, "id" | "createdAt">): Promise<Product> => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...productData,
                createdAt: serverTimestamp(),
            });

            // We return a "Client" version of the product immediately
            return {
                id: docRef.id,
                ...productData,
                createdAt: new Date(),
            };
        } catch (error) {
            console.error("Error creating product:", error);
            throw new Error("Failed to create product.");
        }
    },

    /**
     * Updates an existing product.
     * @param id Product ID
     * @param updates Partial<Product>
     */
    updateProduct: async (id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Promise<void> => {
        try {
            const productRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(productRef, updates);
        } catch (error) {
            console.error(`Error updating product ${id}:`, error);
            throw new Error("Failed to update product.");
        }
    },

    /**
     * Deletes a product by ID.
     * @param id Product ID
     */
    deleteProduct: async (id: string): Promise<void> => {
        try {
            const productRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(productRef);
        } catch (error) {
            console.error(`Error deleting product ${id}:`, error);
            throw new Error("Failed to delete product.");
        }
    },

    /**
     * Fetches products for a specific barber (tenant).
     * @param barberId string
     * @returns Promise<Product[]>
     */
    getProductsByBarberId: async (barberId: string): Promise<Product[]> => {
        try {
            const q = query(collection(db, COLLECTION_NAME), where("barberId", "==", barberId));
            const querySnapshot = await getDocs(q);

            const products: Product[] = [];
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                // Safely handle Timestamp conversion
                const createdAt = data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : new Date();

                products.push({
                    id: docSnap.id,
                    barberId: data.barberId,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    imageUrl: data.imageUrl,
                    stock: data.stock,
                    active: data.active,
                    createdAt: createdAt,
                } as Product);
            });

            return products;
        } catch (error) {
            console.error(`Error fetching products for barber ${barberId}:`, error);
            throw new Error("Failed to fetch products.");
        }
    },
    // ... previous methods

    /**
     * Seeds the database with default products for a barber.
     * @param barberId string
     */
    seedProducts: async (barberId: string): Promise<void> => {
        try {
            const { DEFAULT_PRODUCTS } = await import("../data/seed");

            // Using batch for atomicity (optional but good practice)
            // Ideally we check if they exist, but this is a "Restore/Init" action so we might duplicate if not careful.
            // The logic in the Page/Action ensures we only call this if list is empty or explicitly requested.

            // Simple loop for now as createProduct handles timestamp logic
            const promises = DEFAULT_PRODUCTS.map(product => {
                // Remove ID to let Firestore generate one, or use the preset ID?
                // If we use preset IDs, we might collide if multiple barbers share the same collection (multi-tenant in single collection).
                // The Type definition says `id` is string.
                // Generally in multi-tenant, we want unique IDs.
                // Let's strip the ID from the seed and let Firestore generate a unique one.
                const { id, ...rest } = product;
                return productService.createProduct({
                    ...rest,
                    barberId,
                    // Ensure we reset createdAt
                });
            });

            await Promise.all(promises);
            // In a real app, use writeBatch() for better performance and transaction safety.
        } catch (error) {
            console.error(`Error seeding products for barber ${barberId}:`, error);
            throw new Error("Failed to seed products.");
        }
    }
};
