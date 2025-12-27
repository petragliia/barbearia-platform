import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Eye, EyeOff } from 'lucide-react';
import { BuilderSection } from '@/features/builder/store/useBuilderStore';
import { clsx } from 'clsx';

interface SortableSectionProps {
    section: BuilderSection;
    onRemove: (id: string) => void;
    onToggleVisibility: (id: string) => void;
    children: React.ReactNode;
}

export function SortableSection({ section, onRemove, onToggleVisibility, children }: SortableSectionProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={clsx(
                "relative group mb-4 border-2 rounded-lg bg-white transition-all",
                isDragging ? "border-blue-500 shadow-xl" : "border-transparent hover:border-gray-200"
            )}
        >
            {/* Builder Controls Overlay - Only visible on hover or valid interaction */}
            <div className="absolute top-2 right-2 z-50 flex items-center gap-2 bg-white/90 backdrop-blur shadow-sm p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onToggleVisibility(section.id)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-800"
                    title={section.isVisible ? "Ocultar" : "Mostrar"}
                >
                    {section.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                    onClick={() => onRemove(section.id)}
                    className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"
                    title="Remover Seção"
                >
                    <Trash2 size={16} />
                </button>
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-move p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-800 touch-none"
                >
                    <GripVertical size={16} />
                </div>
            </div>

            {/* Content Area */}
            <div className={clsx(!section.isVisible && "opacity-40 grayscale")}>
                {children}
            </div>
        </div>
    );
}
