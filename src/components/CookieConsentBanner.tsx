"use client";

import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

export default function CookieConsentBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if the consent cookie already exists
        const consent = document.cookie.split('; ').find(row => row.startsWith('barbersaas-consent='));

        // If cookie is not present (or not true), show the banner
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        // Set cookie for 30 days
        const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
        document.cookie = `barbersaas-consent=true; path=/; max-age=${maxAge}`;
        setIsVisible(false);
    };

    const handleReject = () => {
        // For now, just hide the banner for this session
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm p-4 bg-slate-900 border border-slate-800 rounded-lg shadow-lg animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                    <div className="p-2 bg-slate-800 rounded-full h-fit text-amber-500">
                        <Cookie size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white mb-1">
                            Gerenciamento de Cookies
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Usamos cookies para melhorar sua experiência e analisar o tráfego.
                            Ao continuar, você concorda com nossa política.
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 justify-end">
                    <button
                        onClick={handleReject}
                        className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        Rejeitar
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
                    >
                        Aceitar Tudo
                    </button>
                </div>
            </div>
        </div>
    );
}
