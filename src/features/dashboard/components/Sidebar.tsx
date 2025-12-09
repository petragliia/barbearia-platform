'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scissors, Settings, ExternalLink, LogOut, Megaphone } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { clsx } from 'clsx';

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const links = [
        { href: '/dashboard', label: 'Visão Geral', icon: Home },
        { href: '/dashboard/services', label: 'Meus Serviços', icon: Scissors },
        { href: '/dashboard/marketing', label: 'Marketing', icon: Megaphone },
        { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-40">
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Scissors className="text-blue-600" />
                    BarberSaaS
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon size={20} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 space-y-2">
                <a
                    href="/demo/modern" // Placeholder link, ideally dynamic based on user site
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                    <ExternalLink size={20} />
                    Ver meu Site
                </a>
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut size={20} />
                    Sair
                </button>
            </div>
        </aside>
    );
}
