'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/api/auth/callback`
                }
            });
            if (error) throw error;
            // Supabase redirects to provider, so no router.push here needed immediately
        } catch (err: any) {
            console.error(err);
            setError('Erro ao entrar com Google. Tente novamente.');
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        console.log('[Login] Iniciando tentativa de login:', email);

        try {
            // Helper for timeout
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('TIMEOUT')), 15000)
            );

            const loginPromise = supabase.auth.signInWithPassword({
                email,
                password
            });

            console.log('[Login] Aguardando Supabase...');

            // Race between login and 15s timeout
            const result = await Promise.race([loginPromise, timeoutPromise]) as any;

            if (result.error) {
                console.error('[Login] Erro retornado pelo Supabase:', result.error);
                throw result.error;
            }

            console.log('[Login] Sucesso! Redirecionando...');
            router.push('/dashboard');
        } catch (err: any) {
            console.error('[Login] Catch Error:', err);
            if (err.message === 'TIMEOUT') {
                setError('O servidor demorou muito para responder. Verifique sua conexão.');
            } else {
                setError('Email ou senha inválidos.');
            }
        } finally {
            console.log('[Login] Finalizando loading state');
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Digite seu email para recuperar a senha.');
            return;
        }
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            });
            if (error) throw error;
            setResetSent(true);
            setError('');
        } catch (err: any) {
            console.error(err);
            setError('Erro ao enviar email de recuperação.');
        }
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-6 group">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-2 group-hover:bg-white/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                    </div>
                    Voltar para Home
                </Link>

                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/20">
                    <Lock size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Bem-vindo de volta</h2>
                <p className="text-slate-400">Acesse o painel da sua barbearia.</p>
            </div>

            <div className="space-y-4">
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-slate-900 border border-slate-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Entrar com Google
                </button>

                <div className="relative flex items-center justify-center py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800"></div>
                    </div>
                    <span className="relative bg-slate-950 px-4 text-xs text-slate-500 font-medium uppercase tracking-wider">OU</span>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-600 text-sm"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="block text-xs font-semibold text-slate-400">Senha</label>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Esqueceu a senha?
                                </button>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-600 text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 text-red-500 text-xs rounded-xl text-center border border-red-500/20 font-medium">
                            {error}
                        </div>
                    )}

                    {resetSent && (
                        <div className="p-3 bg-green-500/10 text-green-500 text-xs rounded-xl text-center border border-green-500/20 font-medium">
                            Email de recuperação enviado! Verifique sua caixa de entrada.
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-base transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 shadow-lg shadow-blue-600/20"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Ainda não tem uma conta?{' '}
                    <Link href="/register" className="text-white hover:text-blue-400 font-medium hover:underline transition-colors ml-1">
                        Criar Conta
                    </Link>
                </div>
            </div>
        </div>
    );
}
