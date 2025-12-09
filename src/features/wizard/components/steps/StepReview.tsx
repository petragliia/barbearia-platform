import { useWizardStore } from '@/store/useWizardStore';
import { CheckCircle2, Globe, Phone, Scissors, Calendar, AlertCircle } from 'lucide-react';
import OrderBump from '../OrderBump';
import { ADDONS } from '@/config/addons';
import { PLANS } from '@/config/plans';

export default function StepReview() {
    const { barbershopData, selectedTemplate, selectedAddons, selectedPlan } = useWizardStore();

    const getTemplateName = (id: string | null) => {
        switch (id) {
            case 'classic': return 'Classic Gentleman';
            case 'modern': return 'Modern Minimalist';
            case 'urban': return 'Urban Style';
            default: return 'Não selecionado';
        }
    };

    const currentPlan = PLANS.find(p => p.id === selectedPlan) || PLANS[1]; // Default to Starter if not found
    const basePrice = currentPlan.price / 100;

    const addonsTotal = selectedAddons.reduce((total, addonId) => {
        const addon = ADDONS.find(a => a.id === addonId);
        return total + (addon?.price || 0);
    }, 0);

    // If Pro plan, addons are included (price 0 effectively for the user view, or just show as included)
    // But wait, the prompt says: "If Pro: Show Order Bumps as INCLUDED (marked and green), without charging extra."
    // So we shouldn't add their price to the total if the plan is Pro.
    // However, the checkout logic needs to know this too.
    // For simplicity in this view:
    const effectiveAddonsTotal = selectedPlan === 'pro' ? 0 : addonsTotal;
    const finalTotal = basePrice + effectiveAddonsTotal;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tudo pronto!</h2>
                <p className="text-gray-500">Confira os dados antes de finalizar a criação do seu site.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                {/* Header / Template Info */}
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Template Escolhido</p>
                        <h3 className="font-bold text-gray-900">{getTemplateName(selectedTemplate)}</h3>
                    </div>
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        {selectedTemplate?.toUpperCase()}
                    </div>
                </div>

                {/* Barbershop Info */}
                <div className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Barbearia</p>
                            <h4 className="text-xl font-bold text-gray-900">{barbershopData.name}</h4>
                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                                <Globe size={14} />
                                <span className="text-sm">barbersaas.com/{barbershopData.slug}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                                <Phone size={14} />
                                <span className="text-sm">{barbershopData.whatsapp}</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Resumo de Serviços</p>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-gray-900 font-bold mb-2">
                                    <Scissors size={16} className="text-blue-600" />
                                    {barbershopData.services.length} Serviços Cadastrados
                                </div>
                                <p className="text-xs text-gray-500">
                                    Seus clientes poderão agendar estes serviços diretamente pelo site.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Bumps Logic */}
            {selectedPlan === 'free' ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="font-bold text-yellow-800 text-sm">Funcionalidades Limitadas</h4>
                        <p className="text-yellow-700 text-xs mt-1">
                            No plano Gratuito, você não tem acesso a Agendamento Online ou SEO.
                            Faça upgrade para o plano <strong>Starter</strong> ou <strong>Pro</strong> para desbloquear.
                        </p>
                    </div>
                </div>
            ) : selectedPlan === 'pro' ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h4 className="font-bold text-green-800 mb-4">Incluso no seu Plano Pro:</h4>
                    <div className="space-y-3">
                        {ADDONS.map(addon => (
                            <div key={addon.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                                <div className="bg-green-100 text-green-600 p-1 rounded-full">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{addon.title}</p>
                                    <p className="text-xs text-green-600 font-medium">ATIVADO GRATUITAMENTE</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <OrderBump />
            )}

            {/* Total Price */}
            <div className="bg-gray-900 text-white p-6 rounded-2xl flex items-center justify-between shadow-xl">
                <div>
                    <p className="text-gray-400 text-sm font-medium">Plano Selecionado: <span className="text-white font-bold uppercase">{currentPlan.name}</span></p>
                    <p className="text-xs text-gray-500">Cancele quando quiser.</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-bold">
                        {finalTotal === 0 ? 'Grátis' : `R$ ${finalTotal.toFixed(2).replace('.', ',')}`}
                    </span>
                    {finalTotal > 0 && <span className="text-gray-400 text-sm">/mês</span>}
                </div>
            </div>
        </div>
    );
}
