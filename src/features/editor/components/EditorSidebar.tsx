'use client';

import { useEditor } from '@/hooks/useEditor';
import { useSaveTheme } from '@/hooks/useSaveTheme';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Layout,
    Save,
    Eye,
    Edit3,
    Loader2,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import ThemeEditor from '@/features/customization/components/ThemeEditor';
import SectionsEditor from './SectionsEditor';

import { Toast } from '@/components/ui/Toast';

export default function EditorSidebar() {
    const {
        isEditing,
        toggleEditing,
        resetChanges,
        hasChanges,
        data,
        updateContent,
        updateData
    } = useEditor();

    const { saveChanges: persistChanges, saving } = useSaveTheme();

    const [isOpen, setIsOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<'theme' | 'sections'>('theme');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleSave = async () => {
        const result = await persistChanges(true); // force publish
        if (result.success) {
            setToast({ message: 'Site publicado com sucesso!', type: 'success' });
        } else {
            setToast({ message: 'Erro ao salvar alterações.', type: 'error' });
        }
    };

    if (!data) return null;

    return (
        <>
            {/* Toggle Button (when closed) */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ x: -100 }}
                        animate={{ x: 0 }}
                        exit={{ x: -100 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed left-0 top-24 z-50 bg-white p-3 rounded-r-xl shadow-lg border border-l-0 border-slate-200 text-slate-700 hover:text-blue-600 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Main Sidebar */}
            <motion.div
                id="tour-editor-sidebar"
                initial={{ marginLeft: -320 }}
                animate={{ marginLeft: isOpen ? 0 : -320 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="h-screen w-80 bg-white border-r border-slate-200 shadow-2xl z-40 flex flex-col flex-shrink-0 relative"
            >
                {/* Header */}
                <div className="h-16 flex items-center px-6 border-b border-slate-100 flex-shrink-0 justify-between">
                    <span className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <Layout size={18} className="text-blue-600" />
                        Editor Visual
                    </span>
                    <div className="flex items-center gap-1">
                        <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors" title="Voltar ao Dashboard">
                            <LogOut size={20} className="rotate-180" />
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="p-2 grid grid-cols-2 gap-2 border-b border-slate-100 bg-slate-50/50">
                    <button
                        onClick={() => toggleEditing(true)}
                        className={clsx(
                            "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                            isEditing
                                ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        )}
                    >
                        <Edit3 size={16} />
                        Editar
                    </button>
                    <button
                        onClick={() => toggleEditing(false)}
                        className={clsx(
                            "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                            !isEditing
                                ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        )}
                    >
                        <Eye size={16} />
                        Preview
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                    <button
                        onClick={() => setActiveTab('theme')}
                        className={clsx(
                            "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
                            activeTab === 'theme'
                                ? "border-blue-600 text-blue-600 bg-blue-50/10"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                        )}
                    >
                        Tema & Cores
                    </button>
                    <button
                        onClick={() => setActiveTab('sections')}
                        className={clsx(
                            "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
                            activeTab === 'sections'
                                ? "border-blue-600 text-blue-600 bg-blue-50/10"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                        )}
                    >
                        Seções
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-200">
                    {activeTab === 'theme' && (
                        <div className="space-y-6">
                            {/* Template Selector in Sidebar */}
                            <div className="space-y-3 pb-4 border-b border-slate-100">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Template</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'classic', name: 'Classic', color: 'bg-emerald-900' },
                                        { id: 'modern', name: 'Modern', color: 'bg-slate-900' },
                                        { id: 'urban', name: 'Urban', color: 'bg-orange-900' }
                                    ].map((theme) => (
                                        <button
                                            key={theme.id}
                                            onClick={() => updateData({ ...data, template_id: theme.id as 'classic' | 'modern' | 'urban' })}
                                            className={clsx(
                                                "flex flex-col items-center gap-1 p-2 rounded-lg border transition-all text-xs",
                                                data.template_id === theme.id
                                                    ? "border-blue-500 bg-blue-50/50"
                                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            )}
                                        >
                                            <div className={clsx("w-full aspect-square rounded-md mb-1", theme.color)}></div>
                                            <span className={clsx("font-medium", data.template_id === theme.id ? "text-blue-600" : "text-slate-600")}>
                                                {theme.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <ThemeEditor
                                colors={data.colors}
                                onUpdate={(newColors) => {
                                    if (updateData) updateData({ ...data, colors: newColors });
                                }}
                            />

                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">Como Editar</h4>
                                <p className="text-sm text-blue-700 leading-relaxed">
                                    Clique nos textos e imagens diretamente no site ao lado para editá-los. O modo de edição deve estar ativo.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'sections' && (
                        <SectionsEditor />
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
                    {hasChanges && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-md border border-amber-100"
                        >
                            <span className="font-medium">Alterações não salvas</span>
                            <button onClick={resetChanges} className="hover:underline font-bold">Desfazer</button>
                        </motion.div>
                    )}

                    <Button
                        id="tour-editor-save"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10 h-11"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                        Salvar e Publicar
                    </Button>
                </div>

                <AnimatePresence>
                    {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
