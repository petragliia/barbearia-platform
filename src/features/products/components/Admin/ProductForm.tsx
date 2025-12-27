"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "../../schemas/productSchema";
import { ImageUpload } from "./ImageUpload";
import { Loader2 } from "lucide-react";
import { useProductSubmit } from "../../hooks/useProductSubmit";

// Simplified Toast for now - assume parent or global toast provider, or basic alert
// Ideally use a UI library toast. I see "Toast.tsx" in context files, might use that later.

interface ProductFormProps {
    initialData?: ProductFormValues & { id?: string };
    barberId: string;
    onSuccess?: () => void;
}

export function ProductForm({ initialData, barberId, onSuccess }: ProductFormProps) {
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            price: 0,
            stock: 0,
            imageUrl: "",
            active: true,
            barberId: barberId,
        },
    });

    const { isPending, submitProduct } = useProductSubmit({
        onSuccess: () => {
            // Reset form only on creation, or handle logically. 
            // If editing, we might want to keep data or close modal.
            // For now, mirroring previous behavior:
            if (!initialData?.id) {
                form.reset();
            }
            if (onSuccess) onSuccess();
        },
        initialDataId: initialData?.id
    });

    const onSubmit = (data: ProductFormValues) => {
        submitProduct(data);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Imagem do Produto</label>
                <ImageUpload
                    value={form.watch("imageUrl")}
                    onChange={(url) => form.setValue("imageUrl", url)}
                    disabled={isPending}
                />
                {form.formState.errors.imageUrl && (
                    <p className="text-sm text-red-500">{form.formState.errors.imageUrl.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Nome</label>
                    <input
                        {...form.register("name")}
                        disabled={isPending}
                        className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        placeholder="Ex: Pomada Modeladora"
                    />
                    {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Preço (R$)</label>
                    <input
                        type="number"
                        step="0.01"
                        {...form.register("price", { valueAsNumber: true })}
                        disabled={isPending}
                        className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        placeholder="0.00"
                    />
                    {form.formState.errors.price && (
                        <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                    )}
                </div>

                {/* Stock */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Estoque</label>
                    <input
                        type="number"
                        {...form.register("stock", { valueAsNumber: true })}
                        disabled={isPending}
                        className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        placeholder="0"
                    />
                    {form.formState.errors.stock && (
                        <p className="text-sm text-red-500">{form.formState.errors.stock.message}</p>
                    )}
                </div>

                {/* Active Toggle */}
                <div className="flex items-center space-x-3 space-y-2 pt-6">
                    <label className="relative inline-flex cursor-pointer items-center">
                        <input
                            type="checkbox"
                            className="peer sr-only"
                            {...form.register("active")}
                            disabled={isPending}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-slate-800 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300"></div>
                        <span className="ml-3 text-sm font-medium text-slate-200">Produto Ativo</span>
                    </label>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Descrição</label>
                <textarea
                    {...form.register("description")}
                    disabled={isPending}
                    rows={4}
                    className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    placeholder="Detalhes do produto..."
                />
                {form.formState.errors.description && (
                    <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-700 disabled:opacity-50"
            >
                {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {initialData?.id ? "Salvando..." : "Criando..."}
                    </span>
                ) : (
                    initialData?.id ? "Salvar Alterações" : "Criar Produto"
                )}
            </button>
        </form>
    );
}
