'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
    onUpload: (url: string) => void;
    label?: string;
}

export default function ImageUploader({ onUpload, label }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpload(reader.result as string);
                setUploading(false); // Reset uploading state after upload
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all z-20 flex items-center gap-2"
                title="Alterar imagem"
            >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {label && <span className="text-xs font-medium pr-1">{label}</span>}
            </button>
        </>
    );
}
