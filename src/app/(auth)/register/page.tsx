'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { UserPlus, Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleGoogleRegister = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);

            // Redirect to Wizard, preserving params
            const searchParams = new URLSearchParams(window.location.search);
            router.push(`/wizard?${searchParams.toString()}`);
        } catch (err: any) {
            console.error(err);
            setError('Erro ao criar conta com Google. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: name
            });

            // Redirect to Wizard to create the first barbershop
            const searchParams = new URLSearchParams(window.location.search);
            router.push(`/wizard?${searchParams.toString()}`);
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Este email já está em uso.');
            } else {
                setError('Erro ao criar conta. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-sm mx-auto">
            <div className="p-6">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <UserPlus size={24} />
                    </div>
                </div>

                <h2 className="text-2xl font-black text-center text-gray-900 mb-1 tracking-tight">Crie sua conta</h2>
                <p className="text-center text-gray-500 mb-6 font-medium text-sm">Comece a gerenciar sua barbearia hoje</p>

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleRegister}
                        disabled={loading}
                        className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-70 shadow-sm hover:shadow-md"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Criar conta com Google
                    </button>

                    <div className="relative flex items-center justify-center py-1">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <span className="relative bg-white px-4 text-xs text-gray-500 font-medium">ou com email</span>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1 ml-1">Nome Completo</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={16} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50 focus:bg-white placeholder-gray-300 text-sm text-black"
                                    placeholder="Seu Nome"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={16} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50 focus:bg-white placeholder-gray-300 text-sm text-black"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1 ml-1">Senha</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={16} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50 focus:bg-white placeholder-gray-300 text-sm text-black"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1 ml-1">Confirmar Senha</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={16} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50 focus:bg-white placeholder-gray-300 text-sm text-black"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl text-center border border-red-100 font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-xl font-black text-base hover:bg-gray-900 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 mt-2 shadow-xl shadow-black/20"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Criar Conta'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-500 font-medium">
                        Já tem uma conta?{' '}
                        <Link href="/login" className="text-black font-black hover:underline ml-1">
                            Entrar
                        </Link>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/" className="text-xs text-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 font-medium group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Voltar para Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
