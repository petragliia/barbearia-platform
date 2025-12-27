'use client';

import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragEndEvent,
    DragStartEvent,
    TouchSensor,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useBuilderStore } from '@/features/builder/store/useBuilderStore';
import { SortableItem } from './SortableItem';

export default function BuilderList() {
    const {
        sections,
        reorderSections,
        removeSection,
        initializeSections,
        // Add edit handler here or in store later
    } = useBuilderStore();

    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        // Only initialize if empty or needed, currently store handles empty check roughly
        if (sections.length === 0) {
            initializeSections();
        }
    }, [initializeSections, sections.length]);

    // Sensors: We use Pointer/Touch. 
    // Since we use the DRAG HANDLE (activatorNodeRef) in SortableItem, we don't strictly need delay constraints for TouchSensor 
    // because scrolling the list body won't trigger drag. But keeping standard sensors is good.
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor)
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sections.findIndex((s) => s.id === active.id);
            const newIndex = sections.findIndex((s) => s.id === over.id);
            reorderSections(arrayMove(sections, oldIndex, newIndex));
        }
        setActiveId(null);
    };

    const handleEdit = (id: string) => {
        console.log("Edit section", id);
        // Logic to open drawer/modal will go here
    };

    const activeSection = sections.find(s => s.id === activeId);

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">Seções do Site</h2>
                <p className="text-sm text-gray-500">Arraste para reordenar</p>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]} // Enforce vertical movement
            >
                <SortableContext
                    items={sections.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-2 pb-24">
                        {sections.map((section) => (
                            <SortableItem
                                key={section.id}
                                section={section}
                                onRemove={removeSection}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeId && activeSection ? (
                        <SortableItem
                            section={activeSection}
                            onRemove={() => { }}
                            onEdit={() => { }}
                            isActive={true}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
