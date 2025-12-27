"use server";

import { revalidatePath } from "next/cache";
import { productService } from "../services/productService";
import { Product } from "../types";
import { productSchema } from "../schemas/productSchema";

import { checkProductLimit, PlanLimitExceededError } from "@/features/subscription/utils/checkProductLimit";

export async function createProductAction(prevState: any, formData: FormData) {
    try {
        const rawData = {
            name: formData.get("name"),
            description: formData.get("description"),
            price: Number(formData.get("price")), // Assuming pre-processed before sending or raw number from input
            stock: Number(formData.get("stock")),
            imageUrl: formData.get("imageUrl"),
            active: formData.get("active") === "true",
            barberId: formData.get("barberId") as string,
        };

        // Validate with Zod
        const validatedData = productSchema.parse(rawData);

        // Ensure barberId is present (in a real app, getUser() from auth would provide this securely)
        if (!validatedData.barberId) {
            // fallback or throw error if strictly required from client
            // For now, we assume it's passed or handled.
            throw new Error("Barber ID is required");
        }

        // FEATURE GATING CHECK
        await checkProductLimit(validatedData.barberId);

        await productService.createProduct(validatedData as any); // Type assertion for now due to slight mismatch in "id" | "createdAt" handling

        revalidatePath("/dashboard/products");
        return { success: true, message: "Produto criado com sucesso!" };
    } catch (error: any) {
        console.error("Create Product Error:", error);

        if (error.name === "PlanLimitExceededError") {
            // We can return a specific code if the UI handles it, but for now the message is sufficient
            return { success: false, message: error.message };
        }

        return { success: false, message: error.message || "Erro ao criar produto." };
    }
}

export async function updateProductAction(id: string, data: Partial<Product>) {
    try {
        await productService.updateProduct(id, data);
        revalidatePath("/dashboard/products");
        return { success: true, message: "Produto atualizado com sucesso!" };
    } catch (error: any) {
        console.error("Update Product Error:", error);
        return { success: false, message: error.message || "Erro ao atualizar produto." };
    }
}

export async function deleteProductAction(id: string) {
    try {
        await productService.deleteProduct(id);
        revalidatePath("/dashboard/products");
        return { success: true, message: "Produto excluído com sucesso!" };
    } catch (error: any) {
        console.error("Delete Product Error:", error);
        return { success: false, message: error.message || "Erro ao excluir produto." };
    }
}

export async function seedProductsAction(barberId: string) {
    try {
        await productService.seedProducts(barberId);
        revalidatePath("/dashboard/products");
        return { success: true, message: "Produtos padrão restaurados com sucesso!" };
    } catch (error: any) {
        console.error("Seed Products Error:", error);
        return { success: false, message: error.message || "Erro ao restaurar produtos." };
    }
}
