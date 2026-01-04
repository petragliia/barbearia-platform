'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, MessageCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ShareBarbershopCardProps {
    slug?: string;
}

export default function ShareBarbershopCard({ slug }: ShareBarbershopCardProps) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    // Hardcoded domain for now, or could come from env
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://barbersaas.com';
    const shareUrl = slug ? `${baseUrl}/${slug}` : `${baseUrl}/slug-da-barbearia`;

    // WhatsApp URL
    const whatsappText = encodeURIComponent(`Agende seu horário aqui: ${shareUrl}`);
    const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast({
                title: "Link copiado!",
                description: "O link da sua barbearia foi copiado para a área de transferência.",
                variant: "default",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast({
                title: "Erro ao copiar",
                description: "Não foi possível copiar o link.",
                variant: "destructive",
            });
        }
    };

    const handleWhatsAppShare = () => {
        window.open(whatsappUrl, '_blank');
    };

    return (
        <Card className="mb-8 border-l-4 border-l-emerald-500 shadow-md bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <ExternalLink className="w-5 h-5 text-emerald-600" />
                    Compartilhe sua Barbearia
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Divulgue seu link para que seus clientes possam agendar horários online.
                </p>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full flex gap-2">
                        <Input
                            value={shareUrl}
                            readOnly
                            className="bg-white dark:bg-slate-950 font-mono text-sm"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleCopy}
                            className={copied ? "text-green-600 border-green-600" : ""}
                            title="Copiar Link"
                        >
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>

                    <Button
                        onClick={handleWhatsAppShare}
                        className="w-full md:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white font-bold gap-2 shadow-sm"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Enviar no WhatsApp
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
