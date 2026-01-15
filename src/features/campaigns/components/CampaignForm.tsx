'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Send, Users, Loader2 } from 'lucide-react';
import { campaignService } from '../services/CampaignService';
import { useAuth } from '@/features/auth/context/AuthContext';

interface Props {
    onSuccess?: () => void;
}

/**
 * Component for creating and sending mass campaigns
 * 
 * Future Backend Integration (Firebase):
 * Save to: `barbershops/{barberId}/campaigns/{campaignId}`
 * Structure: { title: string, message: string, audience: string, sentAt: timestamp, status: 'sent' | 'draft' }
 */

export default function CampaignForm({ onSuccess }: Props) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [audience, setAudience] = useState('all');

    const handleSend = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await campaignService.createCampaign({
                barbershop_id: user.id,
                title,
                type: 'marketing',
                channel: 'whatsapp', // Defaulting to WhatsApp for MVP
                config: { message, audience },
                active: true
            });
            toast.success(`Campanha "${title}" disparada!`);
            onSuccess?.();
            // Reset form
            setTitle('');
            setMessage('');
        } catch (error) {
            console.error(error);
            toast.error("Erro ao criar campanha");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-6 bg-slate-900 border-slate-800">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="campaign-title" className="text-white">Título da Campanha</Label>
                        <Input
                            id="campaign-title"
                            placeholder="Ex: Promoção de Natal"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Label htmlFor="campaign-message" className="text-white">Mensagem</Label>
                        <Textarea
                            id="campaign-message"
                            placeholder="Escreva sua mensagem aqui..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="mt-2 min-h-[120px]"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            {message.length} caracteres
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="campaign-audience" className="text-white">Público-Alvo</Label>
                        <Select value={audience} onValueChange={setAudience}>
                            <SelectTrigger id="campaign-audience" className="mt-2">
                                <SelectValue placeholder="Selecione o público" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Todos os Clientes
                                    </div>
                                </SelectItem>
                                <SelectItem value="birthdays">
                                    🎂 Aniversariantes do Mês
                                </SelectItem>
                                <SelectItem value="inactive">
                                    💤 Inativos há 30 dias
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            <div className="flex justify-end">
                <Button
                    onClick={handleSend}
                    disabled={!title || !message}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Disparar Agora
                </Button>
            </div>
        </div>
    );
}
