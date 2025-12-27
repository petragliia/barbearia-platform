import { useState, useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createProductAction, updateProductAction } from "../../actions/productActions";
import { ProductFormValues } from "../../schemas/productSchema";
import { useRouter } from "next/navigation";

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
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description || "");
            formData.append("price", String(data.price));
            formData.append("stock", String(data.stock));
            formData.append("imageUrl", data.imageUrl || "");
            formData.append("active", String(data.active));
            formData.append("barberId", data.barberId || "current-user-uid");

            let result;
            try {
                if (initialDataId) {
                    result = await updateProductAction(initialDataId, data);
                } else {
                    result = await createProductAction(null, formData);
                }

                if (result.success) {
                    toast({
                        title: "Sucesso!",
                        description: initialDataId ? "Produto atualizado com sucesso." : "Produto criado com sucesso.",
                        variant: "success"
                    });

                    if (onSuccess) onSuccess();

                    // Refresh data
                    router.refresh();
                } else {
                    toast({
                        title: "Erro ao salvar",
                        description: result.message || "Ocorreu um erro inesperado.",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.error(error);
                toast({
                    title: "Erro inesperado",
                    description: "Não foi possível salvar o produto. Tente novamente.",
                    variant: "destructive"
                });
            }
        });
    };

    return {
        isPending,
        submitProduct
    };
}
