import React from 'react';
import { Palette, Undo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarbershopData } from '@/types/barbershop';

interface ThemeEditorProps {
    colors: BarbershopData['colors'];
    onUpdate: (newColors: BarbershopData['colors']) => void;
}

export default function ThemeEditor({ colors, onUpdate }: ThemeEditorProps) {
    const handleColorChange = (key: keyof typeof colors, value: string) => {
        onUpdate({
            ...colors,
            [key]: value
        });
    };

    const resetDefaults = () => {
        // These defaults might need to be context-aware based on the template in the future
        // For now, we reset to a "safe" default or maybe we should pass in template defaults?
        // Let's just provide a "Modern" default for now as a fallback
        onUpdate({
            primary: '#d4af37',
            secondary: '#000000',
            background: '#ffffff',
            text: '#000000'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 w-80">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2 text-slate-800">
                    <Palette size={18} />
                    Personalizar Cores
                </h3>
                <Button variant="ghost" size="sm" onClick={resetDefaults} title="Restaurar Padrão">
                    <Undo size={14} />
                </Button>
            </div>

            <div className="space-y-4">
                <ColorPicker
                    label="Cor Primária"
                    color={colors.primary}
                    onChange={(c) => handleColorChange('primary', c)}
                />
                <ColorPicker
                    label="Cor Secundária"
                    color={colors.secondary}
                    onChange={(c) => handleColorChange('secondary', c)}
                />
                <ColorPicker
                    label="Fundo (Background)"
                    color={colors.background || '#ffffff'}
                    onChange={(c) => handleColorChange('background', c)}
                />
                <ColorPicker
                    label="Texto"
                    color={colors.text || '#000000'}
                    onChange={(c) => handleColorChange('text', c)}
                />
            </div>
        </div>
    );
}

const ColorPicker = ({ label, color, onChange }: { label: string; color: string; onChange: (c: string) => void }) => {
    return (
        <div className="flex items-center justify-between">
            <label className="text-sm text-slate-600">{label}</label>
            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono uppercase">{color}</span>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border-0 p-0 overflow-hidden shadow-sm"
                />
            </div>
        </div>
    );
};
