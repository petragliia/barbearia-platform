import { useWizardStore } from '@/store/useWizardStore';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface Template {
    id: 'classic' | 'modern' | 'urban';
    name: string;
    description: string;
    color: string;
    image: string;
    recommended?: boolean;
}

const TEMPLATES: Template[] = [
    {
        id: 'classic',
        name: 'Classic Gentleman',
        description: 'Elegância tradicional com tons dourados e serifas.',
        color: '#d4af37',
        image: '/img/classicgentleman.png',
    },
    {
        id: 'modern',
        name: 'Modern Minimalist',
        description: 'Design limpo, foco em fotos e tipografia moderna.',
        color: '#38bdf8',
        image: '/img/modernminimalist.png',
        recommended: true,
    },
    {
        id: 'urban',
        name: 'Urban Style',
        description: 'Visual dark, industrial e impactante.',
        color: '#ef4444',
        image: '/img/urbanstyle.png',
    },
];

export default function StepTemplate() {
    const { selectedTemplate, setTemplate } = useWizardStore();

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Escolha o estilo do seu site</h2>
                <p className="text-gray-500">Você poderá alterar as cores e fotos depois.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {TEMPLATES.map((template) => {
                    const isSelected = selectedTemplate === template.id;

                    return (
                        <motion.div
                            key={template.id}
                            layoutId={`template-${template.id}`}
                            onClick={() => setTemplate(template.id)}
                            initial={false}
                            animate={{
                                scale: isSelected ? 1.05 : 1,
                                borderColor: isSelected ? '#2563eb' : 'transparent',
                                boxShadow: isSelected
                                    ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                                    : '0 0 0 0 transparent'
                            }}
                            whileHover={{
                                scale: isSelected ? 1.05 : 1.02,
                                y: -5,
                                transition: { duration: 0.2 }
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={`
                                relative group cursor-pointer rounded-xl overflow-hidden border-2 bg-white
                                ${!isSelected ? 'border-gray-200 hover:border-gray-300 hover:shadow-lg' : ''}
                            `}
                        >
                            {/* Recommended Badge */}
                            {template.recommended && (
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                                    Recomendado
                                </div>
                            )}

                            {/* Selection Indicator */}
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isSelected ? 1 : 0,
                                    opacity: isSelected ? 1 : 0
                                }}
                                className="absolute top-3 left-3 bg-blue-600 text-white rounded-full p-1 z-10"
                            >
                                <Check size={16} />
                            </motion.div>

                            {/* Image Area */}
                            <div className="aspect-[4/5] bg-gray-100 relative">
                                <img
                                    src={template.image}
                                    alt={template.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                {/* Content Overlay */}
                                <div className="absolute bottom-0 left-0 p-4 text-white">
                                    <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                                    <p className="text-xs text-gray-300 line-clamp-2">{template.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
