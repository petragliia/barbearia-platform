'use client';

import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface EditableTextProps {
    value: string;
    onChange: (val: string) => void;
    isEditing: boolean;
    className?: string;
    as?: any;
    placeholder?: string;
    style?: React.CSSProperties;
    multiline?: boolean;
}

export default function EditableText({
    value,
    onChange,
    isEditing,
    className,
    as: Component = 'p',
    placeholder = 'Empty',
    style,
    multiline = false
}: EditableTextProps) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleBlur = () => {
        if (localValue !== value) {
            onChange(localValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            (e.currentTarget as HTMLInputElement).blur();
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLocalValue('');
        onChange('');
    };

    // If not editing and empty, hide the element (Delete behavior)
    if (!isEditing && !value?.trim()) {
        return null;
    }

    if (isEditing) {
        return (
            <div className={clsx("relative group inline-block w-full", className && className.includes('w-') ? '' : 'w-auto max-w-full')}>
                {multiline ? (
                    <textarea
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        style={style}
                        className={clsx(
                            "bg-slate-900/90 border border-blue-500/50 rounded px-2 py-1 !text-white w-full outline-none focus:ring-2 focus:ring-blue-500 min-w-[100px] resize-none overflow-hidden shadow-xl z-20 placeholder:text-slate-500",
                            // We filter out size classes from className to keep them, but override colors/bg
                            className
                        )}
                    />
                ) : (
                    <input
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        style={style}
                        className={clsx(
                            "bg-slate-900/90 border border-blue-500/50 rounded px-2 py-1 !text-white w-full outline-none focus:ring-2 focus:ring-blue-500 min-w-[100px] shadow-xl z-20 placeholder:text-slate-500",
                            className
                        )}
                    />
                )}

                {/* Clear/Delete Button */}
                <button
                    onClick={handleClear}
                    className="absolute -top-3 -right-3 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-sm hover:bg-red-600"
                    title="Remover texto"
                >
                    <X size={12} />
                </button>
            </div>
        );
    }

    return <Component className={className} style={style}>{value}</Component>;
}
