import { useWizardStore } from '@/store/useWizardStore';
import { Store, Globe, Phone } from 'lucide-react';

export default function StepInfo() {
    const { barbershopData, updateData } = useWizardStore();

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Convert to lowercase and replace spaces/special chars with hyphens
        const slug = value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        updateData({ slug });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        // Mask: (99) 99999-9999
        if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        }
        if (value.length > 10) {
            value = `${value.slice(0, 10)}-${value.slice(10)}`;
        }

        updateData({ whatsapp: value });
    };

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Informações da Barbearia</h2>
                <p className="text-gray-500">Preencha os dados básicos do seu negócio.</p>
            </div>

            <div className="space-y-6">
                {/* Barbershop Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Store size={16} /> Nome da Barbearia
                    </label>
                    <input
                        type="text"
                        value={barbershopData.name}
                        onChange={(e) => updateData({ name: e.target.value })}
                        placeholder="Ex: Barbearia do Zé"
                        className="w-full px-4 py-4 text-2xl font-bold text-gray-900 placeholder-gray-300 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors bg-transparent"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Globe size={16} /> Endereço do Site (Slug)
                    </label>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                        <span className="text-gray-400 font-medium select-none">barbersaas.com/</span>
                        <input
                            type="text"
                            value={barbershopData.slug}
                            onChange={handleSlugChange}
                            placeholder="barbearia-do-ze"
                            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 font-medium placeholder-gray-400 ml-1"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Este será o link que você enviará para seus clientes.</p>
                </div>

                {/* WhatsApp */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Phone size={16} /> WhatsApp para Contato
                    </label>
                    <input
                        type="tel"
                        value={barbershopData.whatsapp}
                        onChange={handlePhoneChange}
                        placeholder="(11) 99999-9999"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>
        </div>
    );
}
