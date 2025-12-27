
import { Client } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar, Clock, DollarSign, User, Phone, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientHistoryModalProps {
    client: Client | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ClientHistoryModal({ client, isOpen, onClose }: ClientHistoryModalProps) {
    if (!client) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto w-full bg-slate-900 border-slate-800 text-slate-100">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-slate-100">
                        <User size={24} className="text-slate-400" />
                        {client.name}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2 text-slate-400">
                        <Phone size={14} />
                        {client.phone}
                    </DialogDescription>
                </DialogHeader>

                {/* Summary Metrics */}
                <div className="grid grid-cols-3 gap-4 my-6">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                        <p className="text-sm text-slate-400 mb-1">Total Gasto</p>
                        <p className="text-xl font-bold text-slate-100">R$ {client.totalSpend.toFixed(2)}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                        <p className="text-sm text-slate-400 mb-1">Visitas</p>
                        <p className="text-xl font-bold text-slate-100">{client.totalVisits}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                        <p className="text-sm text-slate-400 mb-1">Ticket Médio</p>
                        <p className="text-xl font-bold text-slate-100">R$ {client.averageTicket.toFixed(2)}</p>
                    </div>
                </div>

                {/* History Timeline */}
                <div>
                    <h4 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
                        <Clock size={16} />
                        Histórico de Agendamentos
                    </h4>

                    <div className="space-y-4">
                        {client.history.map((app) => (
                            <div key={app.id} className="flex gap-4 relative group">
                                {/* Timeline Line */}
                                <div className="w-12 flex flex-col items-center">
                                    <div className="h-full w-[1px] bg-slate-800 group-last:bg-transparent absolute top-3 left-6 -z-10"></div>
                                    <div className={`w-3 h-3 rounded-full mt-2 z-10 ${app.status === 'confirmed' ? 'bg-green-500' :
                                        app.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                                        }`}></div>
                                </div>

                                <div className="flex-1 bg-slate-950 border border-slate-800 p-3 rounded-lg hover:border-slate-700 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-slate-100">{app.serviceName}</p>
                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {format(new Date(app.date.seconds ? app.date.seconds * 1000 : app.date), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-slate-100">R$ {app.price.toFixed(2)}</p>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${app.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                                                app.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                                                }`}>
                                                {app.status === 'confirmed' ? 'Confirmado' : app.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
