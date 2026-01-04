'use client';

import { useState, useMemo } from 'react';
import {
    format,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    addDays,
    addMonths,
    subMonths,
    subDays,
    isSameMonth,
    getHours,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment } from '@/types/appointment';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Props {
    appointments: Appointment[];
    onDateSelect?: (date: Date) => void;
    colors?: {
        confirmed: string;
        pending: string;
        cancelled: string;
    }
}

type ViewMode = 'month' | 'week';

export default function CalendarView({ appointments, onDateSelect, colors }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<ViewMode>('week');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // Navigation
    const next = () => {
        if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
        else setCurrentDate(addDays(currentDate, 7));
    };

    const prev = () => {
        if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
        else setCurrentDate(subDays(currentDate, 7));
    };

    const today = () => setCurrentDate(new Date());

    // Grid Generatators
    const monthDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentDate));
        const end = endOfWeek(endOfMonth(currentDate));
        return eachDayOfInterval({ start, end });
    }, [currentDate]);

    const weekDays = useMemo(() => {
        const start = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday start
        const end = endOfWeek(currentDate, { weekStartsOn: 0 });
        return eachDayOfInterval({ start, end });
    }, [currentDate]);

    // Hours for Week View (08:00 to 22:00)
    const hours = Array.from({ length: 15 }, (_, i) => i + 8);

    // Helpers
    const getAppointmentsForDay = (date: Date) => {
        return appointments.filter(apt =>
            isSameDay(new Date(apt.date.seconds * 1000), date)
        );
    };

    const getAppointmentStyle = (status: string) => {
        if (colors) {
            const color = colors[status as keyof typeof colors] || colors.pending;
            // Return base classes plus style object key (handled in render)
            return {
                style: {
                    backgroundColor: `${color}20`, // 20% opacity using hex alpha if possible, or just utilize CSS var
                    borderColor: color,
                    color: color,
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                className: 'bg-opacity-20 ' // Tailwind utility to ensure mix if needed
            };
        }

        switch (status) {
            case 'confirmed': return { className: 'bg-green-100 text-green-700 border-green-200' };
            case 'cancelled': return { className: 'bg-red-100 text-red-700 border-red-200 opacity-60' };
            default: return { className: 'bg-blue-100 text-blue-700 border-blue-200' };
        }
    };

    return (
        <Card className="w-full h-full flex flex-col shadow-sm bg-slate-900 border-slate-800 overflow-hidden text-slate-100">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-slate-800 gap-4 bg-slate-950">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prev} className="border-slate-700 bg-slate-800 hover:bg-slate-700">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold w-48 text-center capitalize">
                        {format(currentDate, view === 'month' ? 'MMMM yyyy' : "'Semana de' d MMM", { locale: ptBR })}
                    </span>
                    <Button variant="outline" size="icon" onClick={next} className="border-slate-700 bg-slate-800 hover:bg-slate-700">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={today} className="ml-2 hover:bg-slate-800 hover:text-white">
                        Hoje
                    </Button>
                </div>

                <div className="flex bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setView('week')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'week' ? 'bg-slate-700 shadow text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Semanal
                    </button>
                    <button
                        onClick={() => setView('month')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'month' ? 'bg-slate-700 shadow text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Mensal
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <CardContent className="p-0 flex-1 min-h-0 relative bg-slate-900 overflow-x-auto overflow-y-hidden">
                {view === 'month' ? (
                    <div className="w-full min-w-[800px]">
                        {/* Days Header */}
                        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950">
                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                                <div key={day} className="py-2 text-center text-sm font-medium text-slate-500">
                                    {day}
                                </div>
                            ))}
                        </div>
                        {/* Month Grid */}
                        <div className="grid grid-cols-7 auto-rows-[120px]">
                            {monthDays.map((day, _idx) => {
                                const dayAppointments = getAppointmentsForDay(day);
                                const isCurrentMonth = isSameMonth(day, currentDate);
                                const isToday = isSameDay(day, new Date());

                                return (
                                    <div
                                        key={day.toString()}
                                        onClick={() => onDateSelect?.(day)}
                                        className={`border-b border-r border-slate-800 p-2 relative transition-colors hover:bg-slate-800/50 ${!isCurrentMonth ? 'bg-slate-950/50 text-slate-600' : 'bg-slate-900'}`}
                                    >
                                        <div className={`text-sm font-medium mb-1 ${isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-400'}`}>
                                            {format(day, 'd')}
                                        </div>
                                        <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-thin">
                                            {dayAppointments.slice(0, 3).map(apt => {
                                                const style = getAppointmentStyle(apt.status);
                                                return (
                                                    <div
                                                        key={apt.id}
                                                        onClick={(e) => { e.stopPropagation(); setSelectedAppointment(apt); }}
                                                        className={`text-[10px] px-1.5 py-0.5 rounded border truncate cursor-pointer ${style.className}`}
                                                        style={style.style}
                                                    >
                                                        {format(new Date(apt.date.seconds * 1000), 'HH:mm')} - {apt.customerName}
                                                    </div>
                                                );
                                            })}
                                            {dayAppointments.length > 3 && (
                                                <div className="text-[10px] text-slate-500 pl-1">
                                                    +{dayAppointments.length - 3} mais
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    // Week View
                    <div className="flex flex-col h-full min-w-[800px]">
                        {/* Week Header */}
                        <div className="grid grid-cols-8 border-b border-slate-800 bg-slate-950 flex-shrink-0">
                            <div className="p-4 border-r border-slate-800 text-center text-xs font-medium text-slate-400">Hora</div>
                            {weekDays.map(day => (
                                <div key={day.toString()} className={`p-2 text-center border-r border-slate-800 last:border-r-0 ${isSameDay(day, new Date()) ? 'bg-slate-800/30' : ''}`}>
                                    <div className="text-xs text-slate-500 uppercase">{format(day, 'EEE', { locale: ptBR })}</div>
                                    <div className={`text-sm font-bold mx-auto mt-1 ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center' : 'text-slate-200'}`}>
                                        {format(day, 'd')}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Week Grid (Scrollable) */}
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                            <div className="grid grid-cols-8 relative">
                                {/* Time Column */}
                                <div className="col-span-1 border-r border-slate-800 bg-slate-950/30">
                                    {hours.map(hour => (
                                        <div key={hour} className="h-20 border-b border-slate-800 text-xs text-slate-500 relative">
                                            <span className="absolute -top-2.5 right-2 bg-slate-900 px-1 rounded">
                                                {hour}:00
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Days Columns */}
                                {weekDays.map((day, _dayIdx) => (
                                    <div key={day.toString()} className="col-span-1 border-r border-slate-800 last:border-r-0 relative min-w-[100px]">
                                        {/* Rows for grid lines */}
                                        {hours.map(hour => (
                                            <div key={`${day}-${hour}`} className="h-20 border-b border-slate-800 relative" />
                                        ))}

                                        {/* Absolute Events Overlay */}
                                        {getAppointmentsForDay(day).map(apt => {
                                            const aptDate = new Date(apt.date.seconds * 1000);
                                            const aptHour = getHours(aptDate);
                                            // Only show if within our visible hours range
                                            if (aptHour >= 8 && aptHour <= 22) {
                                                const topOffset = (aptHour - 8) * 80; // 80px per hour
                                                const style = getAppointmentStyle(apt.status);
                                                return (
                                                    <div
                                                        key={apt.id}
                                                        onClick={() => setSelectedAppointment(apt)}
                                                        className={`absolute left-0.5 right-0.5 p-1 rounded-md text-xs border shadow-sm cursor-pointer hover:z-10 transition-all ${style.className}`}
                                                        style={{
                                                            top: `${topOffset}px`,
                                                            height: '76px', // Almost full hour with gap
                                                            ...style.style
                                                        }}
                                                    >
                                                        <div className="font-bold flex justify-between">
                                                            <span>{format(aptDate, 'HH:mm')}</span>
                                                        </div>
                                                        <div className="truncate font-semibold">{apt.customerName}</div>
                                                        <div className="truncate text-[10px] opacity-80">{apt.serviceName}</div>
                                                        {apt.barberName && (
                                                            <div className="absolute bottom-1 right-1">
                                                                <div className="w-5 h-5 bg-black/20 rounded-full flex items-center justify-center text-[10px] font-bold" title={apt.barberName}>
                                                                    {apt.barberName.charAt(0)}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            {/* Details Modal */}
            <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
                <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                    <DialogHeader>
                        <DialogTitle className="text-white">Detalhes do Agendamento</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            {selectedAppointment && format(new Date(selectedAppointment.date.seconds * 1000), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedAppointment && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-xs text-slate-500 font-medium uppercase">Cliente</span>
                                    <div className="font-medium text-slate-200">{selectedAppointment.customerName}</div>
                                    <div className="text-sm text-slate-400">{selectedAppointment.customerPhone}</div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-slate-500 font-medium uppercase">Serviço</span>
                                    <div className="font-medium text-slate-200">{selectedAppointment.serviceName}</div>
                                    <div className="text-sm text-slate-400">R$ {selectedAppointment.price.toFixed(2)}</div>
                                </div>
                            </div>

                            {selectedAppointment.barberName && (
                                <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg">
                                    <Users className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-300">Profissional: {selectedAppointment.barberName}</span>
                                </div>
                            )}

                            <div
                                className="px-2 py-1 rounded text-xs inline-block font-semibold capitalize border"
                                style={getAppointmentStyle(selectedAppointment.status).style}
                            >
                                Status: {selectedAppointment.status}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}
