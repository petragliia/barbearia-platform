import { createClient } from "@/lib/supabase/client";
import { Product } from "../types";
import { canUser, PlanTier } from "@/config/plans";

const TABLE_NAME = "products";

export const productService = {
    /**
     * Creates a new product in Supabase.
     */
    createProduct: async (productData: Omit<Product, "id" | "createdAt">): Promise<Product> => {
        try {
            const supabase = createClient();

            const newProduct = {
                ...productData,
                barber_id: productData.barberId,
                image_url: productData.imageUrl,
                created_at: new Date().toISOString(),
            };

            delete (newProduct as any).barberId;
            delete (newProduct as any).imageUrl;

            const { data, error } = await supabase
                .from(TABLE_NAME)
                .insert([newProduct])
                .select()
                .single();

            if (error) throw error;

            return {
                id: data.id,
                ...productData,
                createdAt: new Date(data.created_at),
            };
        } catch (error) {
            console.error("Error creating product:", error);
            throw new Error("Failed to create product.");
        }
    },

    /**
     * Updates an existing product.
     */
    updateProduct: async (id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Promise<void> => {
        try {
            const supabase = createClient();

            const updateData: any = { ...updates };
            if (updates.barberId) {
                updateData.barber_id = updates.barberId;
                delete updateData.barberId;
            }
            if (updates.imageUrl) {
                updateData.image_url = updates.imageUrl;
                delete updateData.imageUrl;
            }

            const { error } = await supabase
                .from(TABLE_NAME)
                .update(updateData)
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error(`Error updating product ${id}:`, error);
            throw new Error("Failed to update product.");
        }
    },

    /**
     * Deletes a product by ID.
     */
    deleteProduct: async (id: string): Promise<void> => {
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from(TABLE_NAME)
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error(`Error deleting product ${id}:`, error);
            throw new Error("Failed to delete product.");
        }
    },

    /**
     * Fetches products for a specific barber (tenant).
     */
    getProductsByBarberId: async (barberId: string, plan: PlanTier = 'FREE'): Promise<{ data: Product[]; hasPermission: boolean }> => {
        try {
            // DRY Permission Check
            if (!canUser(plan, 'products')) {
                return { data: [], hasPermission: false };
            }

            const supabase = createClient();
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('barber_id', barberId);

            if (error) throw error;

            const products: Product[] = (data || []).map(row => ({
                id: row.id,
                barberId: row.barber_id,
                name: row.name,
                description: row.description,
                price: row.price,
                imageUrl: row.image_url,
                stock: row.stock,
                active: row.active,
                category: row.category || 'general', // Default or map from DB
                createdAt: new Date(row.created_at),
            }));

            return { data: products, hasPermission: true };
        } catch (error) {
            console.error(`Error fetching products for barber ${barberId}:`, error);
            throw new Error("Failed to fetch products.");
        }
    },

    /**
     * Seeds the database with default products for a barber.
     */
    seedProducts: async (barberId: string): Promise<void> => {
        try {
            const { DEFAULT_PRODUCTS } = await import("../data/seed");

            const promises = DEFAULT_PRODUCTS.map(product => {
                const { id, ...rest } = product;
                return productService.createProduct({
                    ...rest,
                    barberId,
                });
            });

            await Promise.all(promises);
        } catch (error) {
            console.error(`Error seeding products for barber ${barberId}:`, error);
            throw new Error("Failed to seed products.");
        }
    }
};
