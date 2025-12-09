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
        try {
            const shopRef = doc(db, 'barbershops', barbershopId);
            // Updating the loyalty field inside the barbershop document
            await updateDoc(shopRef, {
                loyalty: config
            });

            toast({
                title: "Configurações salvas!",
                description: "Seu programa de fidelidade foi atualizado."
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Erro ao salvar",
                description: "Tente novamente mais tarde.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="text-yellow-500" />
                            Programa de Fidelidade VIP
                        </CardTitle>
                        <CardDescription>
                            Configure as regras para fidelizar seus clientes.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="loyalty-active" className="text-sm font-medium">
                            {config.enabled ? 'Ativado' : 'Desativado'}
                        </Label>
                        <Switch
                            id="loyalty-active"
                            checked={config.enabled}
                            onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className={!config.enabled ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
                <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="points-required">Pontos para Resgate</Label>
                            <Input
                                id="points-required"
                                type="number"
                                min="1"
                                value={config.pointsRequired}
                                onChange={(e) => setConfig({ ...config, pointsRequired: Number(e.target.value) })}
                            />
                            <p className="text-xs text-gray-500">
                                Quantos serviços o cliente precisa completar.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reward-name">Prêmio / Recompensa</Label>
                            <div className="relative">
                                <Gift className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="reward-name"
                                    className="pl-9"
                                    value={config.rewardName}
                                    onChange={(e) => setConfig({ ...config, rewardName: e.target.value })}
                                    placeholder="Ex: Corte Grátis, 50% OFF"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex gap-4 items-start">
                        <div className="bg-white p-2 rounded shadow-sm border border-gray-100">
                            <span className="text-2xl font-bold text-gray-900">{config.pointsPerService}</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-yellow-900">Regra de Pontuação</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                                Atualmente o sistema soma <strong>1 ponto</strong> automaticamente a cada agendamento concluído.
                            </p>
                        </div>
                    </div>

                    <Button onClick={handleSave} disabled={loading} className="w-full md:w-auto self-end">
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
