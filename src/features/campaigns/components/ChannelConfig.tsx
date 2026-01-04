'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MessageSquare, Mail, QrCode } from 'lucide-react';

/**
 * Component for configuring notification channels (WhatsApp, Email)
 * 
 * Future Backend Integration (Firebase):
 * Save to: `barbershops/{barberId}/settings/channels`
 * Structure: { whatsapp: { connected: boolean, phone?: string }, email: { enabled: boolean } }
 */
export default function ChannelConfig() {
    const [whatsappConnected, setWhatsappConnected] = useState(false);
    const [emailEnabled, setEmailEnabled] = useState(false);

    return (
        <div className="space-y-6">
            {/* WhatsApp Channel */}
            <Card className="p-6 bg-slate-900 border-slate-800">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">WhatsApp</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            Conecte sua conta do WhatsApp para enviar notificações automáticas.
                        </p>

                        {whatsappConnected ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-slate-300">Conectado: (11) 99999-9999</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setWhatsappConnected(false)}
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                                >
                                    Desconectar
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={() => setWhatsappConnected(true)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                <QrCode className="mr-2 h-4 w-4" />
                                Ler QR Code
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Email Channel */}
            <Card className="p-6 bg-slate-900 border-slate-800">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                        <Mail className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">E-mail</h3>
                            <Switch
                                checked={emailEnabled}
                                onCheckedChange={setEmailEnabled}
                            />
                        </div>
                        <p className="text-slate-400 text-sm">
                            {emailEnabled
                                ? 'Seus clientes receberão notificações por e-mail.'
                                : 'Ative para enviar notificações por e-mail.'}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
