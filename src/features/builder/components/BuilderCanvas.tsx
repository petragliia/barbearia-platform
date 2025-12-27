'use client';

import React, { useEffect, useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragEndEvent,
    TouchSensor,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useBuilderStore, BuilderSection } from '@/features/builder/store/useBuilderStore';
import { SortableSection } from './SortableSection';

// Placeholder components for sections - in a real app these would be your actual template components
const SectionPlaceholder = ({ title, type }: { title?: string, type: string }) => (
    <div className="p-8 border border-dashed border-gray-200 rounded min-h-[150px] flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">{type}</h3>
            <p className="text-sm text-gray-300">{title}</p>
        </div>
    </div>
);

// Map section types to components
const renderSectionContent = (section: BuilderSection) => {
    // logic to switch between actual components based on section.type
    // For now return placeholders or you can import your actual Hero, Services etc.
    switch (section.type) {
        case 'hero':
            return <SectionPlaceholder type="Hero Section" title={section.title} />;
        case 'services':
            return <SectionPlaceholder type="Services List" title={section.title} />;
        case 'testimonials':
            return <SectionPlaceholder type="Testimonials" title={section.title} />;
        case 'gallery':
            return <SectionPlaceholder type="Gallery Grid" title={section.title} />;
        case 'contact':
            return <SectionPlaceholder type="Contact Info" title={section.title} />;
        default:
            return <SectionPlaceholder type="Unknown Section" title={section.title} />;
    }
};

export default function BuilderCanvas() {
    const {
        sections,
        reorderSections,
        removeSection,
        toggleSectionVisibility,
        initializeSections
    } = useBuilderStore();

    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        initializeSections();
    }, [initializeSections]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor, {
            // Require a 250ms press to start dragging on touch devices to avoid scrolling conflict
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
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

    return (
        <div className="max-w-4xl mx-auto p-6 pb-24">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={sections.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {sections.map((section) => (
                            <SortableSection
                                key={section.id}
                                section={section}
                                onRemove={removeSection}
                                onToggleVisibility={toggleSectionVisibility}
                            >
                                {renderSectionContent(section)}
                            </SortableSection>
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeId ? (
                        <div className="opacity-80 bg-white border-2 border-blue-500 shadow-2xl rounded-lg overflow-hidden">
                            {/* Simplified render for overlay */}
                            <SectionPlaceholder type="Moving Section..." />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
