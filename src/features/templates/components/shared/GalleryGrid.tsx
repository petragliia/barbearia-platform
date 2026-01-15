'use client';

import Image from 'next/image';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import ImageUploader from '@/components/ui/ImageUploader';
import EditableImage from '@/components/ui/EditableImage';

interface GalleryGridProps {
    images: string[];
    isEditing?: boolean;
    onUpdate?: (newImages: string[]) => void;
    variant?: 'classic' | 'modern';
    renderOverlay?: (image: string, index: number) => React.ReactNode;
}

export default function GalleryGrid({
    images,
    isEditing = false,
    onUpdate,
    variant = 'classic',
    renderOverlay
}: GalleryGridProps) {
    const handleAddImage = (url: string) => {
        if (onUpdate) {
            onUpdate([...images, url]);
        }
    };

    const handleRemoveImage = (index: number) => {
        if (onUpdate) {
            const newImages = images.filter((_, i) => i !== index);
            onUpdate(newImages);
        }
    };

    const handleUpdateImage = (index: number, url: string) => {
        if (onUpdate) {
            const newImages = [...images];
            newImages[index] = url;
            onUpdate(newImages);
        }
    };

    // Grid Layout Logic based on image count and variant
    const getGridClass = (index: number, total: number) => {
        // Base classes for all items
        const baseClass = "relative group overflow-hidden w-full h-full";

        // Variant specifics
        // Classic: Square/Landscape preferred
        // Modern: Portrait preferred
        const aspectRatio = variant === 'modern' ? 'aspect-[3/4]' : 'aspect-square';

        let spanClass = "";

        if (total === 1) {
            return `${baseClass} col-span-full aspect-[16/9]`;
        }

        if (total === 3) {
            if (index === 0) return `${baseClass} md:col-span-2 md:row-span-2 ${aspectRatio}`;
            return `${baseClass} ${aspectRatio}`;
        }

        // Default grid behavior for other counts (2, 4, 5, 6, etc.)
        // Just standard grid items, maybe first one highlighted if 5?
        // For simplicity and robustness given the prompt:
        return `${baseClass} ${aspectRatio}`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
            {images.map((img, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={getGridClass(i, images.length)}
                >
                    <div className="relative w-full h-full">
                        {variant === 'classic' ? (
                            <EditableImage
                                src={img}
                                alt={`Gallery ${i}`}
                                isEditing={isEditing}
                                onUpload={(url) => handleUpdateImage(i, url)}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                containerClassName="w-full h-full"
                            />
                        ) : (
                            // Modern might just use raw img or specific style, but EditableImage contains logic we want.
                            // Let's stick to simple img for Modern to match existing behavior if needed, 
                            // OR use EditableImage but style it.
                            // Existing Modern uses: img tag + ImageUploader overlay if editing.
                            <>
                                <div className="relative w-full h-full">
                                    <Image
                                        src={img || '/placeholder.jpg'}
                                        alt={`Gallery ${i}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                {isEditing && (
                                    <div className="absolute top-2 right-2 z-20">
                                        <ImageUploader onUpload={(url) => handleUpdateImage(i, url)} />
                                    </div>
                                )}
                            </>
                        )}

                        {/* Custom Overlay */}
                        {renderOverlay && renderOverlay(img, i)}

                        {/* Remove Button */}
                        {isEditing && (
                            <div className="absolute top-2 left-2 z-30">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveImage(i);
                                    }}
                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}

            {isEditing && images.length < 6 && (
                <div className={`flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg min-h-[200px] ${variant === 'modern' ? 'aspect-[3/4]' : 'aspect-square'}`}>
                    <ImageUploader
                        onUpload={handleAddImage}
                        label="Adicionar Foto"
                    />
                </div>
            )}
        </div>
    );
}
