'use client';

import { useState, useEffect } from 'react';
import { useEditor } from '@/features/editor/hooks/useEditor';
import { useSaveTheme } from '@/features/customization/hooks/useSaveTheme';
import { BarbershopData } from '@/types/barbershop';
import { Button } from '@/components/ui/button';
import { Loader2, Undo, Save, Smartphone, Palette, Layout, Type, Upload, Check, Edit3 } from 'lucide-react';
import ImageUploader from '@/components/ui/ImageUploader';
import TemplateClassic from '@/features/templates/components/TemplateClassic';
import TemplateModern from '@/features/templates/components/TemplateModern';
import TemplateUrban from '@/features/templates/components/TemplateUrban';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/context/AuthContext';
import { getBarbershop } from '@/lib/services/barbershopService';

// Mock Font Options (Simulated)
const FONTS = [
    { id: 'sans', name: 'Inter (Modern)', class: 'font-sans' },
    { id: 'serif', name: 'Playfair (Classic)', class: 'font-serif' },
    { id: 'mono', name: 'JetBrains (Tech)', class: 'font-mono' },
];

import { useTour } from '@/features/onboarding/hooks/useTour';

export default function DesignEditorPage() {
    const { user } = useAuth();
    useTour('editor'); // Start editor tour
    const {
        data,
        setInitialData,
        updateContent,
        hasChanges,
        resetChanges,
        updateData
    } = useEditor();

    const { saveChanges, saving } = useSaveTheme();
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit'); // Added viewMode state

    // Load initial data
    useEffect(() => {
        const fetchBarbershop = async () => {
            if (!user) return;
            try {
                const data = await getBarbershop(user.id);
                if (data) {
                    setInitialData(data);
                }
            } catch (error) {
                console.error("Error fetching barbershop:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBarbershop();
    }, [user, setInitialData]);

    if (loading) return <div className="flex h-full items-center justify-center text-slate-400"><Loader2 className="animate-spin mr-2" /> Carregando editor...</div>;
    if (!data) return <div className="flex h-full items-center justify-center text-slate-400">Dados não encontrados.</div>;

    const renderPreview = () => {
        const props = { data, isEditing: false }; // Preview mode (not inline editing)
        switch (data.template_id) {
            case 'modern': return <TemplateModern {...props} />;
            case 'urban': return <TemplateUrban {...props} />;
            case 'classic': default: return <TemplateClassic {...props} />;
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] -m-6 md:-m-8 flex flex-col bg-slate-950">
            {/* Header / Actions Bar */}
            <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 md:px-8 shrink-0 relative z-20">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        <Palette className="text-blue-500" size={20} />
                        Editor de Marca
                    </h1>
                    <div className="h-6 w-px bg-slate-800 hidden md:block"></div>
                    <p className="text-sm text-slate-400 hidden md:block">Personalize a identidade visual do seu site.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={resetChanges} disabled={!hasChanges} className="text-slate-400 hover:text-slate-100 hidden md:flex" title="Desfazer">
                        <Undo size={18} />
                    </Button>
                    <div className="h-6 w-px bg-slate-800 mx-1 hidden md:block"></div>
                    <Button
                        onClick={() => saveChanges()}
                        disabled={saving || !hasChanges}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium min-w-[100px] md:min-w-[140px] text-xs md:text-sm"
                    >
                        {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
                        {saving ? 'Sal...' : 'Publicar'}
                    </Button>
                </div>
            </header>

            {/* Mobile Tabs */}
            <div className="lg:hidden flex border-b border-slate-800 bg-slate-900 sticky top-0 z-30">
                <button
                    onClick={() => setViewMode('edit')}
                    className={cn(
                        "flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2",
                        viewMode === 'edit'
                            ? "border-blue-500 text-blue-500"
                            : "border-transparent text-slate-400"
                    )}
                >
                    <Edit3 size={16} /> Editar
                </button>
                <button
                    onClick={() => setViewMode('preview')}
                    className={cn(
                        "flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2",
                        viewMode === 'preview'
                            ? "border-blue-500 text-blue-500"
                            : "border-transparent text-slate-400"
                    )}
                >
                    <Smartphone size={16} /> Visualizar
                </button>
            </div>

            {/* Main Split View */}
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-8rem)] lg:h-auto">

                {/* Left Panel: Editor Form */}
                <div className={cn(
                    "lg:col-span-7 xl:col-span-8 bg-slate-900 border-r border-slate-800 overflow-y-auto custom-scrollbar h-full",
                    viewMode === 'preview' ? "hidden lg:block" : "block"
                )}>
                    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-10 pb-32 lg:pb-10">

                        {/* 1. Layout / Template Selection */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Layout size={14} /> Layout & Tema
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'classic', name: 'Classic', desc: 'Tradicional & Elegante' },
                                    { id: 'modern', name: 'Modern', desc: 'Clean & Minimalista' },
                                    { id: 'urban', name: 'Urban', desc: 'Dark & Ousado' }
                                ].map((theme) => (
                                    <div
                                        key={theme.id}
                                        onClick={() => updateData({ ...data, template_id: theme.id as 'classic' | 'modern' | 'urban' })}
                                        className={cn(
                                            "cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 relative group",
                                            data.template_id === theme.id
                                                ? "bg-slate-800 border-blue-500 ring-1 ring-blue-500/50"
                                                : "bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-700">
                                                <Layout size={20} className={data.template_id === theme.id ? "text-blue-400" : "text-slate-500"} />
                                            </div>
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                                                data.template_id === theme.id ? "border-blue-500 bg-blue-500" : "border-slate-600 bg-slate-800"
                                            )}>
                                                {data.template_id === theme.id && <Check size={12} className="text-white" />}
                                            </div>
                                        </div>
                                        <h3 className="text-slate-100 font-bold">{theme.name}</h3>
                                        <p className="text-xs text-slate-500 mt-1">{theme.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <hr className="border-slate-800" />

                        {/* 2. Brand Identity */}
                        <section className="space-y-6">
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Upload size={14} /> Identidade Visual
                            </h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-300">Logo e Capa</label>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-800 rounded-xl border border-dashed border-slate-600 hover:border-slate-500 transition-colors">
                                            <p className="text-xs text-slate-400 mb-2 font-medium">Imagem de Capa (Hero)</p>
                                            <div className="aspect-video relative bg-slate-900 rounded-lg overflow-hidden mb-2">
                                                <img src={data.content.hero_image} alt="Cover" className="w-full h-full object-cover opacity-50" />
                                            </div>
                                            <ImageUploader
                                                onUpload={(url) => updateContent('hero_image', url)}
                                                label="Trocar Capa"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-300">Cores da Marca</label>
                                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs text-slate-400">Cor Primária</span>
                                                <span className="text-xs font-mono text-slate-500">{data.colors.primary}</span>
                                            </div>
                                            <input
                                                type="color"
                                                value={data.colors.primary}
                                                onChange={(e) => updateData({ ...data, colors: { ...data.colors, primary: e.target.value } })}
                                                className="w-full h-10 rounded-lg cursor-pointer bg-slate-900 border border-slate-700 p-1"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs text-slate-400">Cor Secundária</span>
                                                <span className="text-xs font-mono text-slate-500">{data.colors.secondary}</span>
                                            </div>
                                            <input
                                                type="color"
                                                value={data.colors.secondary}
                                                onChange={(e) => updateData({ ...data, colors: { ...data.colors, secondary: e.target.value } })}
                                                className="w-full h-10 rounded-lg cursor-pointer bg-slate-900 border border-slate-700 p-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <hr className="border-slate-800" />

                        {/* 3. Typography (Mock) */}
                        <section className="space-y-4">
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Type size={14} /> Tipografia
                            </h2>
                            <div className="bg-slate-800 rounded-xl border border-slate-700 p-1">
                                {FONTS.map(font => {
                                    const isActive = (data.content.font || 'sans') === font.id;
                                    return (
                                        <div
                                            key={font.id}
                                            className="flex items-center justify-between p-4 hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors"
                                            onClick={() => updateContent('font', font.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                                                    isActive ? "border-blue-500 bg-blue-500" : "border-slate-500"
                                                )}>
                                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                </div>
                                                <span className={cn("text-slate-200 text-lg", font.class)}>{font.name}</span>
                                            </div>
                                            <span className="text-xs text-slate-500">AgH</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-slate-500 ml-1">* A tipografia é adaptada automaticamente pelo tema escolhido atualmente.</p>
                        </section>

                        {/* Bottom Spacer */}
                        <div className="h-20"></div>
                    </div>
                </div>

                {/* Right Panel: Live Preview */}
                <div className={cn(
                    "lg:col-span-5 xl:col-span-4 bg-slate-950 relative lg:flex items-center justify-center p-8 border-l border-slate-800 bg-grid-slate-900/[0.04]",
                    viewMode === 'preview' ? "flex h-full w-full fixed inset-0 z-40 bg-slate-950 top-36 lg:relative lg:top-0 lg:h-auto" : "hidden"
                )}>
                    {viewMode === 'preview' && (
                        <div className="absolute top-4 left-4 lg:hidden">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium">
                                <Smartphone size={12} /> Mobile Preview
                            </div>
                        </div>
                    )}

                    <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium hidden lg:flex">
                        <Smartphone size={12} /> Live Preview
                    </div>

                    {/* Phone Mockup Frame */}
                    <div id="tour-editor-preview" className="relative w-[340px] h-[680px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl flex flex-col overflow-hidden ring-4 ring-slate-900/50 scale-90 md:scale-100">
                        {/* Notch/Status Bar Area */}
                        <div className="h-8 bg-slate-900 w-full absolute top-0 z-50 flex justify-center">
                            <div className="h-5 w-32 bg-black rounded-b-xl"></div>
                        </div>

                        {/* Screen Content */}
                        <div className="flex-1 bg-white overflow-y-auto no-scrollbar relative w-full h-full">
                            <div className="origin-top w-full">
                                {/* Render Active Template */}
                                {renderPreview()}
                            </div>
                        </div>

                        {/* Bottom Indicator */}
                        <div className="h-5 bg-black w-full absolute bottom-0 z-50 flex justify-center items-center pointer-events-none">
                            <div className="h-1 w-32 bg-slate-700 rounded-full"></div>
                        </div>
                    </div>

                    <div className="absolute bottom-8 text-center w-full text-slate-500 text-xs hidden lg:block">
                        Visualização mobile gerada em tempo real
                    </div>
                </div>

            </main>
        </div>
    );
}
