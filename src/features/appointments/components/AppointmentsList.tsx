import { Appointment } from '@/types/appointment';
import { Clock, User, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    appointments: Appointment[];
    onStatusUpdate: (id: string, status: 'confirmed' | 'cancelled') => void;
}

export default function AppointmentsList({ appointments, onStatusUpdate }: Props) {
    if (appointments.length === 0) {
        return (
            <div className="border border-dashed border-white/10 rounded-2xl h-64 flex flex-col items-center justify-center bg-white/5">
                <Calendar className="text-slate-700 mb-4" size={48} />
                <p className="text-slate-500 italic">Nenhum registro encontrado.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            <AnimatePresence>
                {appointments.map((app) => (
                    <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group bg-white/5 border border-white/10 hover:border-cyan-500/30 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-white/[0.07]"
                    >
                        <div className="flex items-start gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-white/10 font-bold text-lg",
                                app.status === 'confirmed' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                    app.status === 'cancelled' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                        "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            )}>
                                {app.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-white text-lg">{app.customerName}</h3>
                                    <span className={cn(
                                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border",
                                        app.status === 'confirmed' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                            app.status === 'cancelled' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                    )}>
                                        {app.status === 'confirmed' ? 'Confirmado' : app.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-slate-400 text-sm">
                                    <span className="flex items-center gap-1"><Clock size={14} className="text-cyan-600" /> {new Date(app.date).toLocaleDateString('pt-BR')} às {app.time}</span>
                                    <span className="flex items-center gap-1"><User size={14} className="text-cyan-600" /> {app.serviceName}</span>
                                    <span className="flex items-center gap-1 text-slate-500">R$ {app.price.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center">
                            {app.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => onStatusUpdate(app.id, 'cancelled')}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Cancelar"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                    <button
                                        onClick={() => onStatusUpdate(app.id, 'confirmed')}
                                        className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors" title="Confirmar"
                                    >
                                        <CheckCircle size={20} />
                                    </button>
                                </>
                            )}
                            {app.status === 'confirmed' && (
                                <button
                                    onClick={() => onStatusUpdate(app.id, 'cancelled')}
                                    className="px-4 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-xs font-bold uppercase tracking-wider transition-all"
                                >
                                    Cancelar
                                </button>
                            )}
                            {app.status === 'cancelled' && (
                                <button
                                    onClick={() => onStatusUpdate(app.id, 'confirmed')}
                                    className="px-4 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-xs font-bold uppercase tracking-wider transition-all"
                                >
                                    Reativar
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
