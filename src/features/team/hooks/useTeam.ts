import { useState, useCallback } from 'react';
import { Barber } from '../types';
import { TeamService } from '../services/teamService';
import { useToast } from '@/components/ui/use-toast';

export function useTeam(barbershopId: string) {
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchBarbers = useCallback(async () => {
        if (!barbershopId) return;
        setIsLoading(true);
        try {
            const data = await TeamService.getProfessionals(barbershopId);
            setBarbers(data);
        } catch (error) {
            console.error("Failed to fetch barbers:", error);
            toast({ title: "Erro", description: "Falha ao carregar equipe.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [barbershopId, toast]);

    const saveBarber = async (barberData: Omit<Barber, 'id'>, editingId?: string) => {
        try {
            if (editingId) {
                await TeamService.updateProfessional({
                    ...barberData,
                    id: editingId,
                });
                toast({ title: "Sucesso", description: "Profissional atualizado." });
            } else {
                await TeamService.createProfessional(barberData);
                toast({ title: "Sucesso", description: "Profissional adicionado." });
            }
            await fetchBarbers();
            return true;
        } catch (error: any) {
            console.error("Error saving barber:", error);
            const errorMessage = error.message || "Erro desconhecido ao salvar.";
            toast({
                title: "Erro",
                description: `Falha ao salvar: ${errorMessage}`,
                variant: "destructive"
            });
            return false;
        }
    };

    const deleteBarber = async (barberId: string) => {
        try {
            await TeamService.deleteProfessional(barberId);
            toast({ title: "Removido", description: "Profissional removido com sucesso." });
            await fetchBarbers();
            return true;
        } catch (error) {
            console.error("Error removing barber:", error);
            toast({ title: "Erro", description: "Erro ao remover.", variant: "destructive" });
            return false;
        }
    };

    const toggleActiveBarber = async (barber: Barber) => {
        const originalBarbers = [...barbers];
        const newStatus = !barber.active;

        // Optimistic update
        setBarbers(prev => prev.map(b => b.id === barber.id ? { ...b, active: newStatus } : b));

        try {
            await TeamService.toggleActive(barber.id, newStatus);
        } catch (error) {
            // Revert
            setBarbers(originalBarbers);
            toast({ title: "Erro", description: "Falha ao atualizar status.", variant: "destructive" });
        }
    };

    return {
        barbers,
        isLoading,
        fetchBarbers,
        saveBarber,
        deleteBarber,
        toggleActiveBarber
    };
}
