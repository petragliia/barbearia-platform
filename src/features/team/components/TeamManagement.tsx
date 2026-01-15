
import { useState, useEffect } from 'react';
import { Barber } from '../types';
import { useTeam } from '../hooks/useTeam';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit2, Plus, User as UserIcon, Users } from 'lucide-react';
import ImageUploader from '@/components/ui/ImageUploader';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    barbershopId: string;
}

export default function TeamManagement({ barbershopId }: Props) {
    const {
        barbers,
        isLoading,
        fetchBarbers,
        saveBarber,
        deleteBarber,
        toggleActiveBarber
    } = useTeam(barbershopId);

    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBarber, setEditingBarber] = useState<Barber | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [phone, setPhone] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    useEffect(() => {
        fetchBarbers();
    }, [fetchBarbers]);

    const handleOpenDialog = (barber?: Barber) => {
        if (barber) {
            setEditingBarber(barber);
            setName(barber.name);
            setSpecialty(barber.specialty);
            setPhone(barber.phone || '');
            setPhotoUrl(barber.photoUrl || '');
        } else {
            setEditingBarber(null);
            setName('');
            setSpecialty('');
            setPhone('');
            setPhotoUrl('');
        }
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        // Validation
        if (!name.trim() || !specialty.trim()) {
            toast({ title: "Erro", description: "Nome e especialidade são obrigatórios.", variant: "destructive" });
            return;
        }

        if (!barbershopId) {
            toast({ title: "Erro", description: "ID da barbearia não encontrado.", variant: "destructive" });
            return;
        }

        const barberData: any = {
            name,
            specialty,
            phone,
            photoUrl,
            barbershopId,
            active: editingBarber ? editingBarber.active : true
        };

        const success = await saveBarber(barberData, editingBarber?.id);

        if (success) {
            setIsDialogOpen(false);
        }
    };

    const handleDelete = async (barberId: string) => {
        if (!confirm("Tem certeza que deseja remover este profissional?")) return;
        await deleteBarber(barberId);
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Equipe</h2>
                    <p className="text-slate-400">Gerencie os profissionais da sua barbearia.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenDialog()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-900/20 transition-colors"
                >
                    <Plus size={20} />
                    Adicionar Profissional
                </motion.button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode='popLayout'>
                    {barbers.map((barber, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            key={barber.id}
                            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${!barber.active ? 'bg-slate-900/30 border-slate-800 opacity-60' : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20'}`}
                        >
                            <div className="p-6 flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <div className="h-24 w-24 rounded-full overflow-hidden bg-slate-800 ring-4 ring-slate-800 group-hover:ring-slate-700 transition-all shadow-xl">
                                        {barber.photoUrl ? (
                                            <img src={barber.photoUrl} alt={barber.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-slate-500">
                                                <UserIcon size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 right-0">
                                        <Switch
                                            checked={barber.active}
                                            onCheckedChange={() => toggleActiveBarber(barber)}
                                            className="data-[state=checked]:bg-green-500 ring-2 ring-slate-900"
                                        />
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors">{barber.name}</h3>
                                <p className="text-sm font-medium text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">{barber.specialty}</p>

                                <div className="mt-6 flex items-center gap-2 w-full">
                                    <Button
                                        variant="outline"
                                        className="flex-1 bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white"
                                        onClick={() => handleOpenDialog(barber)}
                                    >
                                        <Edit2 className="mr-2 h-4 w-4" /> Editar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                                        onClick={() => handleDelete(barber.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {barbers.length === 0 && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full py-16 text-center rounded-3xl border-2 border-dashed border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center gap-4"
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                            <Users size={32} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white">Sua equipe está vazia</h3>
                            <p className="text-slate-400 max-w-sm mx-auto">Adicione barbeiros e profissionais para começar a receber agendamentos.</p>
                        </div>
                        <Button onClick={() => handleOpenDialog()} variant="secondary" className="mt-2">
                            Adicionar Primeiro Profissional
                        </Button>
                    </motion.div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">{editingBarber ? 'Editar Profissional' : 'Novo Profissional'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-slate-800 border-4 border-slate-800 shadow-xl group cursor-pointer" onClick={() => (document.querySelector('.image-uploader-btn') as HTMLElement)?.click()}>
                                {photoUrl ? (
                                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                        <UserIcon size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <ImageUploader
                                        onUpload={(url) => setPhotoUrl(url)}
                                        className="image-uploader-btn static bg-transparent p-0 text-white hover:bg-transparent"
                                        label="Alterar"
                                    />
                                </div>
                            </div>
                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Foto do Perfil</span>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-slate-400">Nome Completo</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: João Silva"
                                    className="bg-slate-950 border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-white placeholder:text-slate-600 h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-400">Especialidade</Label>
                                <Input
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                    placeholder="Ex: Cortes Clássicos"
                                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-400">Telefone (Opcional)</Label>
                                <Input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="(00) 00000-0000"
                                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 h-11"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-slate-400 hover:text-white hover:bg-slate-800">Cancelar</Button>
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20">Salvar Profissional</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
