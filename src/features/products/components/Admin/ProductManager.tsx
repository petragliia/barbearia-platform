"use client";

import { useState } from "react";
import { Product } from "../../types";
import { ProductForm } from "./ProductForm";
import { Modal } from "@/components/ui/Modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { deleteProductAction, seedProductsAction } from "../../actions/productActions";
import { Edit, Plus, Trash2, Package, AlertTriangle, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

interface ProductManagerProps {
    initialProducts: Product[];
    barberId: string;
}

export function ProductManager({ initialProducts, barberId }: ProductManagerProps) {
    const [products] = useState<Product[]>(initialProducts);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isRestoring, setIsRestoring] = useState(false);
    const { toast } = useToast();

    const handleCreate = () => {
        setEditingProduct(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeletingId(id);
    };

    const handleRestore = async () => {
        if (confirm("Tem certeza? Isso irá adicionar os produtos padrão novamente.")) {
            setIsRestoring(true);
            const result = await seedProductsAction(barberId);
            setIsRestoring(false);

            if (result.success) {
                toast({ title: "Sucesso", description: result.message });
            } else {
                toast({ title: "Erro", description: result.message, variant: "destructive" });
            }
        }
    };

    const confirmDelete = async () => {
        if (deletingId) {
            const result = await deleteProductAction(deletingId);
            if (result.success) {
                toast({ title: "Sucesso", description: result.message });
            } else {
                toast({ title: "Erro", description: result.message, variant: "destructive" });
            }
            setDeletingId(null);
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
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Novo Produto
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
                {initialProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <Package className="h-16 w-16 mb-4 opacity-50" />
                        <p className="text-lg">Nenhum produto cadastrado.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-950 uppercase text-slate-200 font-medium border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Produto</th>
                                    <th className="px-6 py-4">Preço</th>
                                    <th className="px-6 py-4">Estoque</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {initialProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800">
                                                    {product.imageUrl ? (
                                                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-slate-600">
                                                            <Package className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white">{product.name}</div>
                                                    <div className="text-xs text-slate-500 max-w-[200px] truncate">{product.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-200">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-medium ${product.stock < 5 ? 'text-red-500' : 'text-slate-200'}`}>
                                                    {product.stock}
                                                </span>
                                                {product.stock < 5 && (
                                                    <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-500">
                                                        <AlertTriangle className="h-3 w-3" /> Baixo
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                                                }`}>
                                                {product.active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="rounded-lg p-2 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-500 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(product.id)}
                                                    className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

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
                isOpen={!!deletingId}
                onCancel={() => setDeletingId(null)}
                onConfirm={confirmDelete}
                title="Excluir Produto"
                description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
                confirmLabel="Sim, excluir"
                cancelLabel="Cancelar"
            />
        </div>
    );
}
