
'use client';

import { clsx } from 'clsx';
import ImageUploader from './ImageUploader';
import { Edit, Image as ImageIcon } from 'lucide-react';

interface EditableImageProps {
    src: string;
    alt: string;
    onUpload: (url: string) => void;
    isEditing: boolean;
    className?: string;
    containerClassName?: string;
}

export default function EditableImage({
    src,
    alt,
    onUpload,
    isEditing,
    className,
    containerClassName
}: EditableImageProps) {
    return (
        <div className={clsx("relative group", containerClassName)}>
            <img
                src={src}
                alt={alt}
                className={clsx(
                    className,
                    isEditing && "group-hover:opacity-80 transition-opacity"
                )}
            />

            {isEditing && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform shadow-lg cursor-pointer relative overflow-hidden">
                        <ImageUploader onUpload={onUpload} />
                        <span className="pointer-events-none ml-6">Alterar Imagem</span>
                        <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            )}
        </div>
    );
}
