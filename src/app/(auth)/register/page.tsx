'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { UserPlus, Loader2 } from 'lucide-react';
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
            const result = await signInWithPopup(auth, provider);

            // Check if user already exists in database
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));

            if (userDoc.exists()) {
                // User already has a profile, redirect to dashboard
                router.push('/dashboard');
            } else {
                // New user, redirect to Wizard
                const searchParams = new URLSearchParams(window.location.search);
                router.push(`/wizard?${searchParams.toString()}`);
            }
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
        <div className="w-full">
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-6 group">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-2 group-hover:bg-white/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                    </div>
                    Voltar para Home
                </Link>

                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/20">
                    <UserPlus size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Criar sua conta</h2>
                <p className="text-slate-400">Entre com seus dados para começar.</p>
            </div>

            <div className="space-y-4">
                <button
                    onClick={handleGoogleRegister}
                    disabled={loading}
                    className="w-full bg-slate-900 border border-slate-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Continuar com Google
                </button>

                <button
                    disabled={true} // Placeholder for now
                    className="w-full bg-slate-900 border border-slate-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 bg-blue-600 text-[10px] text-white px-2 py-0.5 rounded-bl-lg font-bold">Em breve</div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 1.5-3 1.5-3 1.5 6 2.5 8 2.5 2 7 2.5 8 2.5 0 1.15-.28 2.35-1 3.5.73 1.02.38 2.25 1 3.5-.2 2.7-3 5.5-6 5.5a4.8 4.8 0 0 0-1 3.5v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                    Continuar com GitHub
                </button>

                <div className="relative flex items-center justify-center py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800"></div>
                    </div>
                    <span className="relative bg-slate-950 px-4 text-xs text-slate-500 font-medium uppercase tracking-wider">OU</span>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1">Nome Completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-600 text-sm"
                                placeholder="Seu Nome"
                                required
                            />
                        </div>

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
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-600 text-sm"
                                placeholder="Min. 6 caracteres"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1">Confirmar Senha</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-600 text-sm"
                                placeholder="Confirmar senha"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 text-red-500 text-xs rounded-xl text-center border border-red-500/20 font-medium">
                            {error}
                        </div>
                    )}

                    <div className="text-xs text-slate-500 px-1">
                        Ao continuar, você concorda com os <a href="#" className="underline hover:text-slate-300">Termos de Serviço</a> e <a href="#" className="underline hover:text-slate-300">Política de Privacidade</a>.
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-base transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 shadow-lg shadow-blue-600/20"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Continuar'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="text-white hover:text-blue-400 font-medium hover:underline transition-colors ml-1">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
