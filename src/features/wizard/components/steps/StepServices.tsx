import { useState } from 'react';
import { useWizardStore } from '@/store/useWizardStore';
import { Scissors, Plus, Trash2, DollarSign, Clock } from 'lucide-react';

export default function StepServices() {
    const { barbershopData, addService, removeService } = useWizardStore();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const handleAdd = () => {
        if (!name || !price) return;

        addService({
            name,
            price: parseFloat(price.replace(',', '.')),
            duration: '30 min' // Default duration for now
        });

        setName('');
        setPrice('');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastre seus Serviços</h2>
                <p className="text-gray-500">Adicione os principais serviços que você oferece.</p>
            </div>

            {/* Services List */}
            <div className="space-y-3">
                {barbershopData.services.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Scissors className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">Nenhum serviço adicionado ainda.</p>
                        <p className="text-sm text-gray-400">Preencha abaixo para começar.</p>
                    </div>
                ) : (
                    barbershopData.services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-200 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                    <Scissors size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{service.name}</h4>
                                    <p className="text-sm text-gray-500">R$ {service.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeService(index)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Remover serviço"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Service Form */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus size={18} className="text-blue-600" /> Novo Serviço
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Corte Degradê"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Preço</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">R$</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="35,00"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                            />
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleAdd}
                    disabled={!name || !price}
                    className="w-full mt-4 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Plus size={20} /> Adicionar Serviço
                </button>
            </div>
        </div>
    );
}
