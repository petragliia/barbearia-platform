"use client";

import { useState } from "react";
import { Product } from "../../types";
import { ProductForm } from "./ProductForm";
import { Modal } from "@/components/ui/Modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { productService } from "../../services/productService";
import { Plus, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// DataTable Imports
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface ProductListProps {
    initialProducts: Product[];
    barberId: string;
}

export function ProductList({ initialProducts, barberId }: ProductListProps) {
    // Note: In a real app with server actions revalidating, props are the source of truth.
    // However, since we are doing some client-side optimistic updates or just waiting for refresh, we can use state or just props.
    // Given the previous code used state for products, we'll keep using state if we want to update it locally without refresh,
    // OR we rely on the parent (page) to re-render. Ideally, server actions (revalidatePath) update the page prop.
    // Let's rely on props => simpler. But wait, sorting/filtering is client side.

    // We will pass 'initialProducts' directly to the table.
    // If we want instant "Delete" feedback before server reloads, we might need optimistic UI.
    // But Data Table handles its own view data.

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [deletingIds, setDeletingIds] = useState<string[]>([]); // Array for bulk support
    const [isRestoring, setIsRestoring] = useState(false);

    // Derived: are we deleting single or multiple?
    const isDeleting = deletingIds.length > 0;
    const isSingleDelete = deletingIds.length === 1;

    const { toast } = useToast();

    const handleCreate = () => {
        setEditingProduct(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        setDeletingIds([id]);
    };

    const handleBulkDelete = (ids: string[]) => {
        setDeletingIds(ids);
    }

    const handleRestore = async () => {
        if (confirm("Tem certeza? Isso irá adicionar os produtos padrão novamente.")) {
            setIsRestoring(true);
            try {
                await productService.seedProducts(barberId);
                toast({ title: "Sucesso", description: "Produtos padrão restaurados." });
                window.location.reload();
            } catch (error) {
                console.error(error);
                toast({ title: "Erro", description: "Falha ao restaurar produtos.", variant: "destructive" });
            } finally {
                setIsRestoring(false);
            }
        }
    };

    const confirmDelete = async () => {
        if (deletingIds.length > 0) {

            // Loop for bulk delete or single API if available
            // For now, we loop or Promise.all.
            // Ideally backend supports bulk delete.
            // We'll reuse the single delete action for simplicity or loop it.

            let successCount = 0;
            let errorCount = 0;

            for (const id of deletingIds) {
                try {
                    await productService.deleteProduct(id);
                    successCount++;
                } catch (error) {
                    console.error(error);
                    errorCount++;
                }
            }

            if (successCount > 0) {
                toast({ title: "Sucesso", description: `${successCount} produto(s) excluído(s).` });
            }
            if (errorCount > 0) {
                toast({ title: "Erro", description: `Falha ao excluir ${errorCount} produto(s).`, variant: "destructive" });
            }

            setDeletingIds([]);
        }
    };

    const onFormSuccess = () => {
        setIsFormOpen(false);
        toast({ title: "Sucesso", description: editingProduct ? "Produto atualizado!" : "Produto criado!" });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Gerenciar Produtos</h2>
                <div className="flex gap-3">
                    <button
                        onClick={handleRestore}
                        disabled={isRestoring}
                        className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700 hover:text-white disabled:opacity-50"
                    >
                        <RefreshCcw className={`h-4 w-4 ${isRestoring ? 'animate-spin' : ''}`} />
                        Restaurar Padrões
                    </button>

                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] hover:shadow-cyan-500/30"
                    >
                        <Plus className="h-4 w-4" />
                        Novo Produto
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={initialProducts}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onBulkDelete={handleBulkDelete}
            />

            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingProduct ? "Editar Produto" : "Novo Produto"}
            >
                <ProductForm
                    initialData={editingProduct}
                    barberId={barberId}
                    onSuccess={onFormSuccess}
                />
            </Modal>

            <ConfirmationModal
                isOpen={isDeleting}
                onCancel={() => setDeletingIds([])}
                onConfirm={confirmDelete}
                title={isSingleDelete ? "Excluir Produto" : "Excluir Múltiplos"}
                description={isSingleDelete
                    ? "Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
                    : `Tem certeza que deseja excluir ${deletingIds.length} produtos selecionados?`}
                confirmLabel="Sim, excluir"
                cancelLabel="Cancelar"
            />
        </div>
    );
}
