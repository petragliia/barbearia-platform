'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2, PartyPopper } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [slug, setSlug] = useState('');
    const [message, setMessage] = useState('Verificando pagamento...');

    useEffect(() => {
        if (!sessionId) {
            setStatus('error');
            setMessage('Sessão inválida.');
            return;
        }

        const verifyPayment = async () => {
            try {
                const response = await fetch('/api/confirm-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId }),
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setSlug(data.slug);
                    setMessage('Pagamento confirmado! Sua barbearia foi criada.');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Erro ao confirmar pagamento.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Erro de conexão.');
            }
        };

        verifyPayment();
    }, [sessionId]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">

                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <Loader2 className="animate-spin text-blue-600" size={48} />
                        <h2 className="text-xl font-bold text-gray-800">{message}</h2>
                        <p className="text-gray-500">Estamos construindo seu site...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4 py-8 animate-in zoom-in duration-500">
                        <div className="bg-green-100 p-4 rounded-full text-green-600 mb-2">
                            <PartyPopper size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Sucesso!</h2>
                        <p className="text-gray-600">{message}</p>

                        <div className="w-full bg-gray-100 rounded-lg p-4 mt-4">
                            <p className="text-sm text-gray-500 mb-1">Seu site está no ar:</p>
                            <p className="font-bold text-blue-600 text-lg">seusaas.com/{slug}</p>
                        </div>

                        <Link
                            href={`/${slug}`}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-4 block"
                        >
                            Acessar meu Site
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <div className="bg-red-100 p-4 rounded-full text-red-600 mb-2">
                            <CheckCircle size={48} className="rotate-45" /> {/* Using CheckCircle as X */}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Ops!</h2>
                        <p className="text-red-600">{message}</p>
                        <Link
                            href="/wizard"
                            className="text-gray-500 hover:text-gray-800 underline mt-4"
                        >
                            Voltar para o Wizard
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
