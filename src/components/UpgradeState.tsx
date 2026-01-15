'use client';

import { Lock, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSubscription } from '@/features/subscription/hooks/useSubscription';
import { cn } from '@/lib/utils';

interface UpgradeStateProps {
    featureName: string;
    className?: string; // Allow custom classes for positioning/margins
    title?: string;
    description?: string;
}

export function UpgradeState({
    featureName,
    className,
    title = "Funcionalidade Premium",
    description
}: UpgradeStateProps) {
    const { openUpgradeModal } = useSubscription();

    return (
        <div className={cn("min-h-[400px] w-full flex items-center justify-center p-4 animate-in fade-in zoom-in duration-500", className)}>
            <Card className="max-w-md w-full relative overflow-hidden bg-gradient-to-b from-background to-secondary/10 border-muted/40 shadow-xl">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col items-center text-center p-8 sm:p-10 space-y-6">
                    {/* Icon Badge */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                        <div className="relative w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center ring-1 ring-primary/20 shadow-sm group">
                            <Lock className="w-8 h-8 text-primary transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="absolute -top-1 -right-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2">
                            <h3 className="text-2xl font-bold tracking-tight text-foreground">
                                {title}
                            </h3>
                        </div>

                        <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                            {description || (
                                <>
                                    O acesso à <span className="font-semibold text-foreground">{featureName}</span> é exclusivo para assinantes do plano <span className="text-primary font-medium">Pro</span>.
                                </>
                            )}
                        </p>
                    </div>

                    <div className="pt-2 w-full sm:w-auto">
                        <Button
                            onClick={openUpgradeModal}
                            size="lg"
                            className="w-full sm:min-w-[200px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Fazer Upgrade Agora
                        </Button>

                        <p className="text-xs text-muted-foreground mt-4">
                            Desbloqueie todo o potencial da sua barbearia hoje.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
