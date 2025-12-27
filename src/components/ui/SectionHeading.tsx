import EditableText from './EditableText';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    align?: 'left' | 'center' | 'right';
    className?: string;
    isEditing?: boolean;
    onTitleChange?: (val: string) => void;
    onSubtitleChange?: (val: string) => void;
}

export default function SectionHeading({
    title,
    subtitle,
    align = 'center',
    className = '',
    isEditing = false,
    onTitleChange,
    onSubtitleChange
}: SectionHeadingProps) {
    const alignmentClass = align === 'left' ? 'text-left items-start' : align === 'right' ? 'text-right items-end' : 'text-center items-center';
    const lineAlignment = align === 'left' ? 'mr-auto' : align === 'right' ? 'ml-auto' : 'mx-auto';

    return (
        <div className={`flex flex-col ${alignmentClass} mb-12 ${className}`}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-3 w-full"
            >
                <EditableText
                    as="span"
                    isEditing={isEditing}
                    value={subtitle || ''}
                    onChange={onSubtitleChange || (() => { })}
                    className="text-classic-gold/80 text-sm tracking-[0.2em] uppercase font-sans block w-full bg-transparent"
                    placeholder="SUBTITULO"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6 relative inline-block w-full"
            >
                <EditableText
                    as="h2"
                    isEditing={isEditing}
                    value={title}
                    onChange={onTitleChange || (() => { })}
                    className="text-3xl md:text-5xl font-bold font-serif text-classic-gold w-full bg-transparent"
                    placeholder="TITULO DA SEÇÃO"
                />
            </motion.div>

            {!isEditing && (
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    whileInView={{ width: 100, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className={`h-[2px] bg-gradient-to-r from-transparent via-classic-gold to-transparent ${lineAlignment}`}
                />
            )}
        </div>
    );
}
