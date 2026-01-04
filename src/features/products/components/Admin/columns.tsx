"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Product } from "../../types"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUpDown, Edit, Trash2, AlertTriangle, Package } from "lucide-react"
import Image from "next/image"

export const columns: ColumnDef<Product>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Produto",
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800">
                        {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-600">
                                <Package className="h-5 w-5" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-white">{product.name}</div>
                        <div className="text-xs text-slate-500 max-w-[150px] truncate">{product.description}</div>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-transparent pl-0"
                >
                    Preço
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(price)

            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "stock",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-transparent pl-0"
                >
                    Estoque
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const stock = row.getValue("stock") as number;
            return (
                <div className="flex items-center gap-2">
                    <span className={`font-medium ${stock < 5 ? 'text-red-500' : 'text-slate-200'}`}>
                        {stock}
                    </span>
                    {stock < 5 && (
                        <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] text-red-500 whitespace-nowrap">
                            <AlertTriangle className="h-3 w-3" /> Baixo
                        </span>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("active") as boolean;
            return (
                <Badge variant="outline" className={`${isActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-700'}`}>
                    {isActive ? 'Ativo' : 'Inativo'}
                </Badge>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const product = row.original
            const meta = table.options.meta as any; // We will pass handlers via meta

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => meta?.onEdit(product)}
                            className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer"
                        >
                            <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem
                            onClick={() => meta?.onDelete(product.id)}
                            className="text-red-500 hover:bg-slate-800 focus:bg-slate-800 cursor-pointer"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
