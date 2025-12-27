"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Image from "next/image";
import { Loader2, UploadCloud, X } from "lucide-react";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            if (file.size > 5 * 1024 * 1024) {
                setError("Imagem muito grande (max 5MB)");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const fileExt = file.name.split(".").pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const storageRef = ref(storage, `products/${fileName}`);

                await uploadBytes(storageRef, file);
                const downloadUrl = await getDownloadURL(storageRef);

                onChange(downloadUrl);
            } catch (err) {
                console.error("Upload error:", err);
                setError("Erro ao fazer upload da imagem");
            } finally {
                setLoading(false);
            }
        },
        [onChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".webp"],
        },
        maxFiles: 1,
        disabled: disabled || loading,
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(""); // Clear value
    };

    return (
        <div className="w-full space-y-2">
            <div
                {...getRootProps()}
                className={`
          relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed 
          bg-slate-800 p-6 transition-colors duration-200
          ${isDragActive ? "border-cyan-500 bg-slate-700" : "border-slate-700 hover:border-slate-600"}
          ${disabled ? "cursor-not-allowed opacity-50" : ""}
          ${error ? "border-red-500" : ""}
        `}
            >
                <input {...getInputProps()} />

                {loading ? (
                    <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
                ) : value ? (
                    <div className="relative h-48 w-full">
                        <div className="relative h-full w-full overflow-hidden rounded-md">
                            <Image
                                src={value}
                                alt="Upload preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-md transition-colors hover:bg-red-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                        <UploadCloud className="h-10 w-10 mb-2 text-cyan-500" />
                        <p className="text-sm font-medium">
                            Arraste uma imagem ou clique para selecionar
                        </p>
                        <p className="text-xs text-slate-500">
                            JPG, PNG, WebP (Max 5MB)
                        </p>
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
