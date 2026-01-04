"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    RowSelectionState
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Trash2, PowerOff, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onEdit: (data: TData) => void
    onDelete: (id: string) => void
    onBulkDelete?: (ids: string[]) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onEdit,
    onDelete,
    onBulkDelete
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        meta: {
            onEdit,
            onDelete
        }
    })

    // Bulk Actions
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const hasSelection = selectedRows.length > 0;

    const handleBulkDelete = () => {
        if (onBulkDelete) {
            // Assume 'id' exists on TData (weak types here but pragmatic)
            const ids = selectedRows.map(r => (r.original as any).id);
            onBulkDelete(ids);
            setRowSelection({});
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                    <Input
                        placeholder="Filtrar por nome..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm bg-slate-900 border-slate-700 text-white"
                    />

                    {/* Simple faceted filter for Status - could be expanded */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto md:ml-0 bg-slate-900 border-slate-700 text-slate-300">
                                <Filter className="mr-2 h-4 w-4" /> Status
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="bg-slate-900 border-slate-800">
                            <DropdownMenuCheckboxItem
                                checked={(table.getColumn("active")?.getFilterValue() as boolean) === true}
                                onCheckedChange={(val) => {
                                    // Toggle filter logic needs care for boolean
                                    if (val) table.getColumn("active")?.setFilterValue(true);
                                    else table.getColumn("active")?.setFilterValue(undefined); // Clear filter
                                }}
                                className="text-slate-300"
                            >
                                Ativo
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={(table.getColumn("active")?.getFilterValue() as boolean) === false}
                                onCheckedChange={(val) => {
                                    if (val) table.getColumn("active")?.setFilterValue(false);
                                    else table.getColumn("active")?.setFilterValue(undefined);
                                }}
                                className="text-slate-300"
                            >
                                Inativo
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="bg-slate-900 border-slate-700 text-slate-300 ml-auto">
                            Colunas <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize text-slate-300"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* BULK ACTIONS BAR */}
            {hasSelection && (
                <div className="flex items-center justify-between p-2 bg-slate-800/80 border border-slate-700 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm text-slate-300 px-2">{selectedRows.length} item(s) selecionado(s)</span>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={handleBulkDelete}
                            className="h-8"
                        >
                            <Trash2 className="mr-2 h-3 w-3" /> Excluir Selecionados
                        </Button>
                    </div>
                </div>
            )}

            <div className="rounded-md border border-slate-800 bg-slate-900/50">
                <Table>
                    <TableHeader className="bg-slate-800/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-slate-800 hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-slate-300">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-slate-800 hover:bg-slate-800/30 data-[state=selected]:bg-slate-800/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-slate-400">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-slate-500"
                                >
                                    Nenhum resultado encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de{" "}
                    {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="bg-slate-900 border-slate-700 text-slate-300"
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="bg-slate-900 border-slate-700 text-slate-300"
                    >
                        Próximo
                    </Button>
                </div>
            </div>
        </div>
    )
}
