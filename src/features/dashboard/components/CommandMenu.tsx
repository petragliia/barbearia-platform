"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Scissors,
    Settings,
    Globe,
    Megaphone,
    ShoppingBag,
    Trophy,
    CreditCard,
    Search,
    Users,
    ArrowRight
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CommandMenuProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
    const router = useRouter();
    const [query, setQuery] = React.useState("");

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onOpenChange(!open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [onOpenChange, open]);

    const runCommand = React.useCallback((command: () => void) => {
        onOpenChange(false);
        command();
    }, [onOpenChange]);

    const items = [
        {
            group: "Dashboard",
            items: [
                { name: "Visão Geral", icon: LayoutDashboard, href: "/dashboard" },
                { name: "Agendamentos", icon: Calendar, href: "/dashboard/appointments" },
                { name: "Clientes", icon: Users, href: "/dashboard/clients" },
                { name: "Equipe", icon: Users, href: "/dashboard/team" },
                { name: "Serviços", icon: Scissors, href: "/dashboard/services" },
                { name: "Produtos", icon: ShoppingBag, href: "/dashboard/products" },
                { name: "Marketing", icon: Megaphone, href: "/dashboard/marketing" },
                { name: "Fidelidade", icon: Trophy, href: "/dashboard/loyalty" },
            ]
        },
        {
            group: "Configurações & Conta",
            items: [
                { name: "Seu Site", icon: Globe, href: "/dashboard/site" },
                { name: "Seu Plano", icon: CreditCard, href: "/dashboard/plan" },
                { name: "Configurações", icon: Settings, href: "/dashboard/settings" },
            ]
        }
    ];

    const filteredItems = items.map(group => ({
        ...group,
        items: group.items.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        )
    })).filter(group => group.items.length > 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 overflow-hidden bg-slate-950 border-white/10 sm:max-w-[500px]">
                <DialogTitle className="sr-only">Menu de Comandos</DialogTitle>
                <DialogDescription className="sr-only">Navegue pelas opções do dashboard</DialogDescription>
                <div className="flex items-center border-b border-white/5 px-4">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-slate-400" />
                    <Input
                        className={cn(
                            "flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50",
                            "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                        )}
                        placeholder="Buscar no dashboard..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="max-h-[300px] overflow-y-auto px-2 py-2">
                    {filteredItems.length === 0 && (
                        <p className="p-4 text-center text-sm text-slate-500">
                            Nenhum resultado encontrado.
                        </p>
                    )}
                    {filteredItems.map((group) => (
                        <div key={group.group} className="mb-4 last:mb-0">
                            <h3 className="mb-2 px-2 text-xs font-semibold text-slate-500">
                                {group.group}
                            </h3>
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => runCommand(() => router.push(item.href))}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-300 transition-colors",
                                            "hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 border border-white/5">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <span>{item.name}</span>
                                        <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-50" />
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
