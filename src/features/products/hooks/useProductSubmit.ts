"use client";

import { useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ProductFormValues } from "../schemas/productSchema";
import { useRouter } from "next/navigation";
import { productService } from "../services/productService";
import { checkProductLimit, PlanLimitExceededError } from "@/features/subscription/utils/checkProductLimit";

interface UseProductSubmitProps {
    onSuccess?: () => void;
    initialDataId?: string;
}

export function useProductSubmit({ onSuccess, initialDataId }: UseProductSubmitProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { toast } = useToast();

    const submitProduct = (data: ProductFormValues) => {
        startTransition(async () => {
            try {
                const barberId = data.barberId || "current-user-uid"; // Should come from auth context in real app

                if (initialDataId) {
                    // Update
                    await productService.updateProduct(initialDataId, {
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        stock: data.stock,
                        imageUrl: data.imageUrl || "",
                        active: data.active,
                        category: data.category
                    });

                    toast({
                        title: "Sucesso!",
                        description: "Produto atualizado com sucesso.",
                        variant: "success"
                    });
                } else {
                    // Create
                    // Check limit first
                    await checkProductLimit(barberId);

                    await productService.createProduct({
                        name: data.name,
                        description: data.description || "",
                        price: data.price,
                        stock: data.stock,
                        imageUrl: data.imageUrl || "",
                        active: data.active || true, // Default to true if undefined
                        category: data.category,
                        barberId: barberId
                    });

                    toast({
                        title: "Sucesso!",
                        description: "Produto criado com sucesso.",
                        variant: "success"
                    });
                }

                if (onSuccess) onSuccess();

                // Refresh data
                router.refresh();

            } catch (error: any) {
                console.error(error);

                if (error instanceof PlanLimitExceededError || error.name === "PlanLimitExceededError") {
                    toast({
                        title: "Limite Atingido",
                        description: error.message,
                        variant: "destructive"
                    });
                } else {
                    toast({
                        title: "Erro ao salvar",
                        description: error.message || "Ocorreu um erro inesperado.",
                        variant: "destructive"
                    });
                }
            }
        });
    };

    return {
        isPending,
        submitProduct
    };
}
