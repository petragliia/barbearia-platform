'use client';

import { useState } from 'react';
import { LoyaltyConfig } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Gift, Save, Award } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { n8nService } from '@/services/n8nService';

interface LoyaltyDashboardConfigProps {
    barbershopId: string;
    initialConfig?: LoyaltyConfig;
}

export default function LoyaltyDashboardConfig({ barbershopId, initialConfig }: LoyaltyDashboardConfigProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState<LoyaltyConfig>(initialConfig || {
        enabled: false,
        pointsPerService: 1,
        pointsRequired: 10,
        rewardName: 'Corte Grátis'
    });

    const handleSave = async () => {
        if (!barbershopId) return;
        setLoading(true);

        toast({
            title: "Sincronizando...",
            description: "Conectando com n8n...",
        });

        try {
            const shopRef = doc(db, 'barbershops', barbershopId);
            // Updating the loyalty field inside the barbershop document
            await updateDoc(shopRef, {
                loyalty: config
            });

            // Trigger n8n webhook
            await n8nService.triggerWorkflow('update-settings', {
                barbershopId,
                type: 'LOYALTY_UPDATE',
                config
            });

            toast({
                title: "Configurações salvas!",
                description: "Seu programa de fidelidade foi atualizado."
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Erro ao salvar",
                description: "Falha na sincronização. Tente novamente.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Award className="text-blue-500" />
                            Programa de Fidelidade VIP
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Configure as regras para fidelizar seus clientes.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="loyalty-active" className="text-sm font-medium text-slate-300">
                            {config.enabled ? 'Ativado' : 'Desativado'}
                        </Label>
                        <Switch
                            id="loyalty-active"
                            checked={config.enabled}
                            onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                            className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-700"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className={!config.enabled ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
                <div className="grid gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="points-required" className="text-slate-300">Pontos para Resgate</Label>
                            <Input
                                id="points-required"
                                type="number"
                                min="1"
                                value={config.pointsRequired}
                                onChange={(e) => setConfig({ ...config, pointsRequired: Number(e.target.value) })}
                                className="bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-blue-500"
                            />
                            <p className="text-xs text-slate-500">
                                Quantos serviços o cliente precisa completar.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="reward-name" className="text-slate-300">Prêmio / Recompensa</Label>
                            <div className="relative">
                                <Gift className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                <Input
                                    id="reward-name"
                                    className="pl-9 bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-blue-500"
                                    value={config.rewardName}
                                    onChange={(e) => setConfig({ ...config, rewardName: e.target.value })}
                                    placeholder="Ex: Corte Grátis, 50% OFF"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex gap-4 items-start">
                        <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                            <span className="text-2xl font-bold text-blue-400">{config.pointsPerService}</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white">Regra de Pontuação</h4>
                            <p className="text-sm text-slate-400 mt-1">
                                Atualmente o sistema soma <strong className="text-blue-400">1 ponto</strong> automaticamente a cada agendamento concluído.
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full md:w-auto self-end bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                        {loading ? 'Salvando...' : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Salvar Configurações
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
