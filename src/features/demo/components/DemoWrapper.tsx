'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BarbershopData } from '@/types/barbershop';
import TemplateClassic from '@/features/templates/components/TemplateClassic';
import TemplateModern from '@/features/templates/components/TemplateModern';
import TemplateUrban from '@/features/templates/components/TemplateUrban';
import DemoOverlay from '@/features/demo/components/DemoOverlay';
import DemoCustomizer from '@/features/demo/components/DemoCustomizer';


interface DemoWrapperProps {
    initialData: BarbershopData;
    templateId: string;
}

import SocialProofWidget from '@/features/reviews/components/SocialProofWidget';
import { useDemoStore } from '@/store/useDemoStore';

export default function DemoWrapper({ initialData, templateId }: DemoWrapperProps) {
    const [data, setData] = useState<BarbershopData>(initialData);
    const [isEditing, setIsEditing] = useState(false);
    const { showReviews } = useDemoStore();

    // Generic update handler passed to templates
    const handleUpdate = (newData: BarbershopData) => {
        setData(newData);
    };

    const renderTemplate = () => {
        const commonProps = {
            data,
            isEditing,
            onUpdate: handleUpdate,
        };

        switch (templateId) {
            case 'classic':
                return <TemplateClassic {...commonProps} />;
            case 'modern':
                return <TemplateModern {...commonProps} />;
            case 'urban':
                return <TemplateUrban {...commonProps} />;
            default:
                return <TemplateClassic {...commonProps} />;
        }
    };

    return (
        <>
            {renderTemplate()}
            {showReviews && <SocialProofWidget templateId={templateId} />}
            < DemoOverlay
                templateId={templateId}
                isEditing={isEditing}
                onToggleEdit={() => setIsEditing(!isEditing)}
            />
            <AnimatePresence>
                {isEditing && (
                    <DemoCustomizer
                        colors={data.content.colors}
                        onUpdate={(newColors) => handleUpdate({
                            ...data,
                            content: { ...data.content, colors: newColors }
                        })}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
