import { useWizardStore } from '@/store/useWizardStore';
import { ADDONS } from '@/config/addons';
import { Check, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export default function OrderBump() {
    const { selectedAddons, toggleAddon } = useWizardStore();

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Turbine seu plano (Opcional)</h3>
            <div className="space-y-3">
                {ADDONS.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.id);
                    const Icon = addon.icon;

                    return (
                        <motion.div
                            key={addon.id}
                            onClick={() => toggleAddon(addon.id)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={clsx(
                                "relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4",
                                isSelected
                                    ? "bg-blue-50 border-blue-500"
                                    : "bg-white border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <div className={clsx(
                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                            )}>
                                <Icon size={20} />
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className={clsx("font-bold text-sm", isSelected ? "text-blue-900" : "text-gray-900")}>
                                        {addon.title}
                                    </h4>
                                    <span className={clsx("text-sm font-bold", isSelected ? "text-blue-700" : "text-gray-900")}>
                                        + R$ {addon.price.toFixed(2).replace('.', ',')}/mês
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">{addon.description}</p>
                            </div>

                            <div className={clsx(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                isSelected
                                    ? "bg-blue-500 border-blue-500 text-white"
                                    : "border-gray-300 text-transparent"
                            )}>
                                <Check size={14} strokeWidth={3} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
