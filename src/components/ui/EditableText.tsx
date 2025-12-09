'use client';

import { clsx } from 'clsx';

interface EditableTextProps {
    value: string;
    onChange: (val: string) => void;
    isEditing: boolean;
    className?: string;
    as?: any;
    placeholder?: string;
    style?: React.CSSProperties;
}

export default function EditableText({
    value,
    onChange,
    isEditing,
    className,
    as: Component = 'p',
    placeholder = '',
    style
}: EditableTextProps) {
    if (isEditing) {
        return (
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={style}
                className={clsx(
                    "bg-white/10 border border-white/20 rounded px-2 py-1 text-inherit w-full outline-none focus:ring-2 focus:ring-blue-500 min-w-[100px]",
                    className
                )}
            />
        );
    }
    return <Component className={className} style={style}>{value}</Component>;
}
