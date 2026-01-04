'use client';

import { ArrowRight, ArrowLeft, Brush, X, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DemoOverlayProps {
    templateId: string;
    isEditing?: boolean;
    onToggleEdit?: () => void;
}

export default function DemoOverlay({ templateId, isEditing, onToggleEdit }: DemoOverlayProps) {
    const router = useRouter();

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl w-auto max-w-[92vw] justify-between sm:justify-center">
            <Link
                href="/"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors shrink-0"
                title="Voltar"
            >
                <ArrowLeft size={18} />
            </Link>

            <div className="h-6 w-[1px] bg-white/10 mx-1 shrink-0"></div>

            <div className="flex items-center gap-2 shrink-0">
                {onToggleEdit && (
                    <button
                        onClick={onToggleEdit}
                        className={`
                            flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap
                            ${isEditing
                                ? 'bg-white text-black hover:bg-gray-200'
                                : 'bg-transparent text-white hover:bg-white/10 border border-white/20'
                            }
                        `}
                    >
                        {isEditing ? <Check size={16} /> : <Brush size={16} />}
                        <span className="hidden sm:inline">{isEditing ? 'Concluir Edição' : 'Editar Site'}</span>
                    </button>
                )}

                <Link
                    href={`/register?selectedTemplate=${templateId}`}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium text-sm transition-all shadow-lg shadow-blue-600/20 whitespace-nowrap"
                >
                    <span className="hidden xs:inline">Quero este modelo</span>
                    <span className="inline xs:hidden">Quero modelo</span>
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}
