'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Clock, Save, CheckCircle2 } from 'lucide-react';
import { BarbershopData } from '@/types/barbershop';

const DAYS_OF_WEEK = [
    { id: 0, label: 'Domingo' },
    { id: 1, label: 'Segunda' },
    { id: 2, label: 'Terça' },
    { id: 3, label: 'Quarta' },
    { id: 4, label: 'Quinta' },
    { id: 5, label: 'Sexta' },
    { id: 6, label: 'Sábado' },
];

export default function AvailabilityPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6]); // Default Mon-Sat
    const [hours, setHours] = useState({ start: '09:00', end: '19:00' });

    useEffect(() => {
        const fetchSettings = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'barbershops', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as BarbershopData;
                    if (data.content?.availability) {
                        setSelectedDays(data.content.availability.days);
                        setHours(data.content.availability.hours);
                    }
                }
            } catch (error) {
                console.error("Error fetching availability:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        setSuccess(false);

        try {
            const docRef = doc(db, 'barbershops', user.uid);
            await updateDoc(docRef, {
                'content.availability': {
                    days: selectedDays,
                    hours: hours
                }
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving availability:", error);
            alert("Erro ao salvar configurações.");
        } finally {
            setSaving(false);
        }
    };

    const toggleDay = (dayId: number) => {
        setSelectedDays(prev =>
            prev.includes(dayId)
                ? prev.filter(d => d !== dayId)
                : [...prev, dayId].sort()
        );
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-400">Carregando...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-100">Disponibilidade</h1>
                <p className="text-slate-400">Defina seus dias e horários de atendimento.</p>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-8 shadow-sm">
                {/* Working Days */}
                <div>
                    <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                        <Clock size={18} />
                        Dias de Trabalho
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {DAYS_OF_WEEK.map((day) => (
                            <label
                                key={day.id}
                                className={`
                                    flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all
                                    ${selectedDays.includes(day.id)
                                        ? 'bg-blue-600 text-white border-blue-500 font-medium shadow-md shadow-blue-900/20'
                                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:bg-slate-900'}
                                `}
                            >
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedDays.includes(day.id)}
                                    onChange={() => toggleDay(day.id)}
                                />
                                <span className="text-sm">{day.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Working Hours */}
                <div>
                    <h3 className="font-semibold text-slate-100 mb-4">Horário de Atendimento</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm text-slate-400 mb-1">Abertura</label>
                            <input
                                type="time"
                                value={hours.start}
                                onChange={(e) => setHours(prev => ({ ...prev, start: e.target.value }))}
                                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                            />
                        </div>
                        <span className="text-slate-500 mt-6">-</span>
                        <div className="flex-1">
                            <label className="block text-sm text-slate-400 mb-1">Fechamento</label>
                            <input
                                type="time"
                                value={hours.end}
                                onChange={(e) => setHours(prev => ({ ...prev, end: e.target.value }))}
                                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-4">
                    {success && (
                        <span className="text-green-500 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                            <CheckCircle2 size={16} />
                            Salvo com sucesso!
                        </span>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px] shadow-lg shadow-blue-900/20"
                    >
                        {saving ? 'Salvando...' : (
                            <>
                                <Save size={18} className="mr-2" />
                                Salvar
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
