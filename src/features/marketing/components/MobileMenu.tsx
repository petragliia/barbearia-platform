'use client';

import { Menu, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from '@/components/ui/sheet';

export default function MobileMenu() {
    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <button
                        className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Abrir menu"
                    >
                        <Menu size={24} />
                    </button>
                </SheetTrigger>

                <SheetContent side="right" className="border-l border-slate-800 bg-[#020817] text-white w-full max-w-xs flex flex-col">
                    <SheetHeader className="text-left mb-8">
                        <SheetTitle className="text-white text-xl font-bold flex items-center gap-2">
                            Menu
                        </SheetTitle>
                    </SheetHeader>

                    <nav className="flex flex-col gap-6 flex-grow">
                        <SheetClose asChild>
                            <Link
                                href="#features"
                                className="text-lg font-medium text-slate-300 hover:text-blue-400 flex items-center justify-between"
                            >
                                Funcionalidades
                            </Link>
                        </SheetClose>

                        <SheetClose asChild>
                            <Link
                                href="#templates"
                                className="text-lg font-medium text-slate-300 hover:text-blue-400 flex items-center justify-between"
                            >
                                Modelos
                            </Link>
                        </SheetClose>

                        <SheetClose asChild>
                            <Link
                                href="#pricing"
                                className="text-lg font-medium text-slate-300 hover:text-blue-400 flex items-center justify-between"
                            >
                                Preços
                            </Link>
                        </SheetClose>

                        <hr className="border-white/10 my-2" />

                        <SheetClose asChild>
                            <Link
                                href="/login"
                                className="text-lg font-medium text-slate-300 hover:text-blue-400 block"
                            >
                                Entrar
                            </Link>
                        </SheetClose>
                    </nav>

                    <div className="mt-auto pb-4">
                        <SheetClose asChild>
                            <Link href="/register">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-lg shadow-lg shadow-blue-600/20">
                                    Começar Grátis <ArrowRight size={20} className="ml-2" />
                                </Button>
                            </Link>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
