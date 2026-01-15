'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Service } from '@/types/barbershop';
import { Barber } from '@/features/team/types';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Calendar, Smartphone, User, Scissors } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const appointmentSchema = z.object({
    customerName: z.string().min(2, 'Nome muito curto'),
    customerPhone: z.string().min(14, 'Telefone incompleto'), // (11) 99999-9999 is 15 chars, simple check
    serviceIndex: z.string().min(1, 'Selecione um serviço'),
    barberId: z.string().min(1, 'Selecione um barbeiro'),
    datetime: z.string().min(1, 'Selecione data e hora'),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface NewAppointmentModalProps {
    services: Service[];
    barbers: Barber[];
    onSuccess: () => void;
}

export default function NewAppointmentModal({ services, barbers, onSuccess }: NewAppointmentModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();
    const supabase = createClient();

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),
    });

    const formatPhone = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d)(\d{4})$/, '$1-$2')
            .slice(0, 15);
    };

    const onSubmit = async (data: AppointmentFormData) => {
        if (!user) return;
        setLoading(true);

        try {
            const selectedService = services[parseInt(data.serviceIndex)];
            const selectedBarber = barbers.find(b => b.id === data.barberId);

            // ISO conversion for Supabase
            const dateObj = new Date(data.datetime);
            const isoDate = dateObj.toISOString();
            const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            const { error } = await supabase.from('appointments').insert({
                barbershop_id: user.id || (user as any).uid,
                customer_name: data.customerName,
                customer_phone: data.customerPhone,
                service_name: selectedService.name,
                service_price: selectedService.price,
                service_duration: selectedService.duration,
                date: isoDate,
                time: timeStr,
                status: 'confirmed',
                barber_id: selectedBarber?.id || null,
                barber_name: selectedBarber?.name || 'Barbeiro'
            });

            if (error) throw error;

            toast({
                title: "Agendamento Criado!",
                description: `${data.customerName} - ${dateObj.toLocaleString('pt-BR')}`,
                className: "bg-cyan-950 border-cyan-500/50 text-cyan-50"
            });

            setOpen(false);
            reset();
            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Erro ao agendar",
                description: error.message || "Tente novamente.",
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] hover:shadow-[0_0_25px_rgba(8,145,178,0.5)]"
                >
                    <Plus size={20} /> NOVO AGENDAMENTO
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a0a0a] border border-cyan-500/30 text-white sm:max-w-[500px] shadow-[0_0_50px_rgba(0,0,0,1)]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-5 h-5" /> Agendamento Manual
                    </DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Preencha os dados abaixo para registrar um novo cliente.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 py-4">
                    {/* Clientes e Contato */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-400 text-xs uppercase tracking-wider">Cliente</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                <Input
                                    id="name"
                                    {...register('customerName')}
                                    className="pl-9 bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 text-white placeholder:text-slate-700"
                                    placeholder="Nome completo"
                                />
                            </div>
                            {errors.customerName && <span className="text-red-400 text-[10px] uppercase font-bold">{errors.customerName.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-slate-400 text-xs uppercase tracking-wider">WhatsApp</Label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                <Input
                                    id="phone"
                                    {...register('customerPhone')}
                                    onChange={(e) => {
                                        e.target.value = formatPhone(e.target.value);
                                        register('customerPhone').onChange(e);
                                    }}
                                    className="pl-9 bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 text-white placeholder:text-slate-700"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                            {errors.customerPhone && <span className="text-red-400 text-[10px] uppercase font-bold">{errors.customerPhone.message}</span>}
                        </div>
                    </div>

                    {/* Data e Hora */}
                    <div className="space-y-2">
                        <Label htmlFor="datetime" className="text-slate-400 text-xs uppercase tracking-wider">Data e Horário</Label>
                        <div className="relative">
                            <Input
                                id="datetime"
                                type="datetime-local"
                                {...register('datetime')}
                                className="bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 text-white [color-scheme:dark]"
                            />
                        </div>
                        {errors.datetime && <span className="text-red-400 text-[10px] uppercase font-bold">{errors.datetime.message}</span>}
                    </div>

                    {/* Serviços e Profissionais */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-400 text-xs uppercase tracking-wider">Serviço</Label>
                            <Select onValueChange={(val) => setValue('serviceIndex', val)}>
                                <SelectTrigger className="bg-white/5 border-white/10 focus:ring-cyan-500/20 focus:border-cyan-500/50 text-white">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0a0a0a] border border-white/10 text-slate-300">
                                    {services.map((service, idx) => (
                                        <SelectItem key={idx} value={idx.toString()} className="focus:bg-cyan-900/20 focus:text-cyan-400">
                                            {service.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.serviceIndex && <span className="text-red-400 text-[10px] uppercase font-bold">{errors.serviceIndex.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-400 text-xs uppercase tracking-wider">Barbeiro</Label>
                            <Select onValueChange={(val) => setValue('barberId', val)}>
                                <SelectTrigger className="bg-white/5 border-white/10 focus:ring-cyan-500/20 focus:border-cyan-500/50 text-white">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0a0a0a] border border-white/10 text-slate-300">
                                    {barbers.map((barber) => (
                                        <SelectItem key={barber.id} value={barber.id} className="focus:bg-cyan-900/20 focus:text-cyan-400">
                                            {barber.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.barberId && <span className="text-red-400 text-[10px] uppercase font-bold">{errors.barberId.message}</span>}
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <div className="flex w-full gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                                className="flex-1 text-slate-500 hover:text-white hover:bg-white/5"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-wide shadow-[0_0_15px_rgba(8,145,178,0.2)]"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirmar Agendamento
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
