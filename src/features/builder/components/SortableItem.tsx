import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2 } from 'lucide-react';
import { BuilderSection } from '@/features/builder/store/useBuilderStore';
import { clsx } from 'clsx';

interface SortableItemProps {
    section: BuilderSection;
    onRemove: (id: string) => void;
    onEdit: (id: string) => void;
    isActive?: boolean; // For DragOverlay styling
}

export function SortableItem({ section, onRemove, onEdit, isActive = false }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        setActivatorNodeRef, // Critical for handle-only drag
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={clsx(
                "flex items-center justify-between p-3 bg-white border rounded-lg mb-3 touch-none select-none",
                isActive ? "shadow-xl scale-105 border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200 shadow-sm",
                isDragging && "opacity-50"
            )}
        >
            {/* Content Area (Not Draggable) */}
            <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {section.title || section.type}
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                    {section.type}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
                {/* Edit Button - 44x44px touch target */}
                <button
                    onClick={() => onEdit(section.id)}
                    className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-blue-600 active:bg-blue-50 rounded-full transition-colors"
                    aria-label="Edit Section"
                >
                    <Edit size={20} />
                </button>

                {/* Delete Button - 44x44px touch target */}
                <button
                    onClick={() => onRemove(section.id)}
                    className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-red-600 active:bg-red-50 rounded-full transition-colors"
                    aria-label="Remove Section"
                >
                    <Trash2 size={20} />
                </button>

                {/* Drag Handle - 44x44px touch target */}
                <div
                    ref={setActivatorNodeRef}
                    {...attributes}
                    {...listeners}
                    className="w-11 h-11 flex items-center justify-center text-gray-300 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none"
                    aria-label="Drag to reorder"
                >
                    <GripVertical size={24} />
                </div>
            </div>
        </div>
    );
}
