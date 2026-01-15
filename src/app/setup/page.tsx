'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { createBarbershop } from '@/lib/services/barbershopService';
import { Loader2, Zap, Check, LayoutGrid, Smartphone } from 'lucide-react';

// --- Schema ---
const setupSchema = z.object({
    name: z.string().min(3, 'Mínimo 3 caracteres'),
    slug: z.string().min(3, 'Mínimo 3 caracteres').regex(/^[a-z0-9-]+$/, 'Apenas letras minúsculas e hífens'),
    themeId: z.enum(['classic', 'modern', 'urban', 'volt']),
});

type SetupFormData = z.infer<typeof setupSchema>;

// --- Temas Cyber ---
const THEMES = [
    {
        id: 'classic',
        name: 'CLASSIC DARK',
        desc: 'Visual sóbrio e tradicional.',
        color: 'border-slate-500',
        gradient: 'from-slate-900 to-slate-800'
    },
    {
        id: 'modern',
        name: 'CLEAN FUTURE',
        desc: 'Minimalismo de alto contraste.',
        color: 'border-blue-500',
        gradient: 'from-blue-950 to-slate-900'
    },
    {
        id: 'volt',
        name: 'NEON VOLT',
        desc: 'Energia pura para público jovem.',
        color: 'border-cyan-400',
        gradient: 'from-cyan-950 to-slate-900'
    },
];

export default function SetupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const router = useRouter();

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SetupFormData>({
        resolver: zodResolver(setupSchema),
        defaultValues: { themeId: 'modern' },
    });

    const selectedThemeId = watch('themeId');
    const selectedTheme = THEMES.find(t => t.id === selectedThemeId);

    const onSubmit = async (data: SetupFormData) => {
        setIsLoading(true);
        setServerError('');
        try {
            await createBarbershop({
                name: data.name,
                slug: data.slug,
                template_id: data.themeId,
            });
            router.push('/dashboard');
            router.refresh();
        } catch (error) {
            console.error(error);
            setServerError(error instanceof Error ? error.message : 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden flex">

            {/* Background Grid Effect */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* --- ESQUERDA: FORM --- */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-6 lg:px-20 xl:px-32 border-r border-white/5 bg-[#0a0a0a]/90 backdrop-blur-sm lg:w-1/2">
                <div className="max-w-md w-full mx-auto">

                    <div className="mb-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                            <Zap className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">SETUP <span className="text-cyan-400">INICIAL</span></h1>
                        <p className="text-slate-500">Configure sua identidade digital.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Input Nome */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nome da Barbearia</label>
                            <input
                                {...register('name')}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                placeholder="Ex: CYBER CUTS"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        {/* Input Slug */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">URL do Sistema</label>
                            <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
                                <span className="px-4 py-3 text-slate-500 bg-white/5 border-r border-white/5 select-none text-sm">barbersaas.com/</span>
                                <input
                                    {...register('slug')}
                                    className="flex-1 bg-transparent px-4 py-3 text-cyan-400 placeholder-slate-700 focus:outline-none"
                                    placeholder="cyber-cuts"
                                />
                            </div>
                            {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
                        </div>

                        {/* Seleção de Temas */}
                        <div className="space-y-3 pt-4">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <LayoutGrid size={14} /> Selecione a Skin
                            </label>
                            <div className="grid gap-3">
                                {THEMES.map(theme => (
                                    <div
                                        key={theme.id}
                                        onClick={() => setValue('themeId', theme.id as SetupFormData['themeId'])}
                                        className={`cursor-pointer group relative p-4 rounded-xl border transition-all duration-300 ${selectedThemeId === theme.id
                                            ? `bg-cyan-950/20 ${theme.color} shadow-[0_0_20px_rgba(0,0,0,0.5)]`
                                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className={`font-bold ${selectedThemeId === theme.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{theme.name}</h3>
                                                <p className="text-xs text-slate-500 mt-1">{theme.desc}</p>
                                            </div>
                                            {selectedThemeId === theme.id && <div className="bg-cyan-500 rounded-full p-1"><Check size={14} className="text-black" /></div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Erro do Servidor */}
                        {serverError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center animate-pulse">
                                ⚠️ {serverError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : 'INICIALIZAR SISTEMA 🚀'}
                        </button>
                    </form>
                </div>
            </div>

            {/* --- DIREITA: PREVIEW --- */}
            <div className={`hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center bg-gradient-to-br ${selectedTheme?.gradient || 'from-slate-900 to-black'} transition-colors duration-700`}>
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

                {/* Celular Mockup */}
                <div className="relative z-10 w-[300px] h-[600px] bg-[#000] rounded-[3rem] border-8 border-[#1a1a1a] shadow-2xl shadow-black overflow-hidden ring-1 ring-white/10">
                    {/* Dynamic Content Preview */}
                    <div className="absolute top-0 w-full h-full flex flex-col">
                        {/* Header Fake */}
                        <div className="h-40 bg-gradient-to-b from-cyan-900/50 to-transparent flex items-center justify-center pt-8">
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                <span className="text-2xl">💈</span>
                            </div>
                        </div>

                        <div className="flex-1 p-6 flex flex-col items-center text-center mt-4">
                            <h2 className="text-white text-2xl font-bold uppercase tracking-widest">{watch('name') || 'BARBER NAME'}</h2>
                            <p className="text-slate-400 text-xs mt-2 uppercase tracking-wide">Agende no futuro</p>

                            <div className="w-full mt-10 space-y-3">
                                <div className="h-12 w-full bg-white/5 rounded-lg border border-white/10 animate-pulse"></div>
                                <div className="h-12 w-full bg-white/5 rounded-lg border border-white/10 animate-pulse delay-75"></div>
                            </div>

                            <button className="mt-auto w-full py-3 bg-cyan-600 rounded-full text-white font-bold shadow-[0_0_15px_rgba(8,145,178,0.5)]">
                                AGENDAR
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-2 text-slate-500 text-sm uppercase tracking-widest">
                    <Smartphone size={16} /> Preview Mobile
                </div>
            </div>
        </div>
    );
}