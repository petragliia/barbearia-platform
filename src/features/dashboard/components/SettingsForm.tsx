'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Loader2, CheckCircle2, User, Image as ImageIcon, Phone, Instagram, MapPin } from 'lucide-react';
import { BarbershopData } from '@/types/barbershop';
import ImageUploader from '@/components/ui/ImageUploader';
import { User as AuthUser } from 'firebase/auth';

interface SettingsFormProps {
    user: AuthUser;
}

export default function SettingsForm({ user }: SettingsFormProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    // Default to 'general' tab
    const [_activeTab, setActiveTab] = useState("general");

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        phone: '',
        whatsapp: '',
        address: '',
        instagram: '',
        hero_image: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, 'barbershops', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as BarbershopData;
                    setFormData({
                        name: data.name,
                        description: data.content?.description || '',
                        phone: data.contact?.phone || '',
                        whatsapp: data.contact?.whatsapp || '',
                        address: data.contact?.address || '',
                        instagram: data.contact?.instagram || '',
                        hero_image: data.content?.hero_image || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        setSuccess(false);

        try {
            const docRef = doc(db, 'barbershops', user.uid);

            await updateDoc(docRef, {
                'name': formData.name,
                'content.description': formData.description,
                'contact.phone': formData.phone,
                'contact.whatsapp': formData.whatsapp,
                'contact.address': formData.address,
                'contact.instagram': formData.instagram,
                'content.hero_image': formData.hero_image
            });

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Erro ao salvar alterações.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    // Shared input styles to fix dark mode glitch
    const inputClass = "bg-slate-950 border-2 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-blue-600 focus-visible:border-blue-600 rounded-xl h-12 transition-all hover:border-slate-700";
    const labelClass = "text-slate-300 font-bold mb-1.5 block";

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Header Actions */}
                <div className="flex items-center gap-4 ml-auto">
                    {success && (
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/50 px-4 py-2 rounded-full border border-emerald-900/50 animate-in fade-in slide-in-from-right-4 shadow-lg shadow-emerald-900/20">
                            <CheckCircle2 size={18} />
                            <span className="text-sm font-bold">Salvo com sucesso!</span>
                        </div>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px] shadow-lg shadow-blue-900/20 rounded-xl h-11 font-bold transition-all hover:scale-105 active:scale-95"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
                {/* Desktop Tabs */}
                <TabsList className="bg-slate-950/40 border-2 border-slate-800/60 p-1.5 rounded-2xl w-full md:w-auto mb-8 hidden md:inline-flex gap-2">
                    <TabsTrigger
                        value="general"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 font-medium transition-all data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/20 hover:text-white hover:bg-white/5"
                    >
                        <User size={18} /> Geral
                    </TabsTrigger>
                    <TabsTrigger
                        value="visual"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 font-medium transition-all data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/20 hover:text-white hover:bg-white/5"
                    >
                        <ImageIcon size={18} /> Visual
                    </TabsTrigger>
                    <TabsTrigger
                        value="contact"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 font-medium transition-all data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/20 hover:text-white hover:bg-white/5"
                    >
                        <Phone size={18} /> Contato
                    </TabsTrigger>
                </TabsList>

                {/* Mobile Tabs */}
                <div className="md:hidden mb-6 overflow-x-auto pb-2">
                    <TabsList className="bg-slate-950/40 border-2 border-slate-800/60 p-1.5 rounded-2xl inline-flex w-max gap-1">
                        <TabsTrigger value="general" className="px-4 py-2 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 hover:text-white"><User size={16} className="mr-2" /> Geral</TabsTrigger>
                        <TabsTrigger value="visual" className="px-4 py-2 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 hover:text-white"><ImageIcon size={16} className="mr-2" /> Visual</TabsTrigger>
                        <TabsTrigger value="contact" className="px-4 py-2 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 hover:text-white"><Phone size={16} className="mr-2" /> Contato</TabsTrigger>
                    </TabsList>
                </div>

                {/* --- TAB: GERAL --- */}
                <TabsContent value="general">
                    <Card className="border-2 border-slate-800 shadow-xl shadow-black/40 bg-slate-900 text-white overflow-hidden rounded-[2rem]">
                        <CardHeader className="border-b border-slate-800/50 pb-6 mb-2">
                            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                                <span className="bg-blue-600/20 p-2 rounded-lg text-blue-500"><User size={20} /></span>
                                Informações Básicas
                            </CardTitle>
                            <CardDescription className="text-slate-400 text-base">Dados principais exibidos no topo do seu site.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className={labelClass}>Nome da Barbearia</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`${inputClass} max-w-md font-medium`}
                                    placeholder="Ex: Barbearia do Zé"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className={labelClass}>Descrição / Slogan</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={`${inputClass} max-w-xl`}
                                    placeholder="Ex: Estilo e tradição desde 2010."
                                />
                                <p className="text-xs text-slate-400">Aparece logo abaixo do nome no cabeçalho.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- TAB: VISUAL --- */}
                <TabsContent value="visual">
                    <Card className="border-2 border-slate-800 shadow-xl shadow-black/40 bg-slate-900 text-white overflow-hidden rounded-[2rem]">
                        <CardHeader className="border-b border-slate-800/50 pb-6 mb-2">
                            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                                <span className="bg-purple-600/20 p-2 rounded-lg text-purple-500"><ImageIcon size={20} /></span>
                                Identidade Visual
                            </CardTitle>
                            <CardDescription className="text-slate-400 text-base">Personalize as imagens do seu site.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-6">
                            {/* Hero Image */}
                            <div className="space-y-4">
                                <Label className={`text-base ${labelClass}`}>Imagem de Capa (Hero)</Label>
                                <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-800/30 hover:bg-slate-800/50 transition-colors group">
                                    {formData.hero_image ? (
                                        <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/50 mb-6 border border-slate-700 group-hover:scale-[1.02] transition-transform duration-500">
                                            <img src={formData.hero_image} alt="Capa" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-500 border border-slate-700">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                    <div className="max-w-xs w-full">
                                        <ImageUploader
                                            onUpload={(url) => setFormData({ ...formData, hero_image: url })}
                                            label={formData.hero_image ? "Trocar Imagem" : "Adicionar Imagem"}
                                            className="static bg-blue-600 hover:bg-blue-500 w-full justify-center h-12 rounded-xl text-base shadow-lg shadow-blue-900/20"
                                        />
                                    </div>
                                    <p className="text-sm text-slate-400 mt-4 text-center">Recomendado: 1920x1080px (Alta resolução)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- TAB: CONTATO --- */}
                <TabsContent value="contact">
                    <Card className="border-2 border-slate-800 shadow-xl shadow-black/40 bg-slate-900 text-white overflow-hidden rounded-[2rem]">
                        <CardHeader className="border-b border-slate-800/50 pb-6 mb-2">
                            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                                <span className="bg-green-600/20 p-2 rounded-lg text-green-500"><Phone size={20} /></span>
                                Canais de Contato
                            </CardTitle>
                            <CardDescription className="text-slate-400 text-base">Como seus clientes encontram você.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 pt-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className={`flex items-center gap-2 ${labelClass}`}><Phone size={14} /> Telefone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="(11) 99999-9999"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp" className={`flex items-center gap-2 ${labelClass}`}><Phone size={14} className="text-green-600" /> WhatsApp</Label>
                                    <Input
                                        id="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                        placeholder="5511999999999"
                                        className={inputClass}
                                    />
                                    <p className="text-[10px] text-slate-400">Inclua o código do país (55) e DDD. Apenas números.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className={`flex items-center gap-2 ${labelClass}`}><MapPin size={14} /> Endereço Completo</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Rua Exemplo, 123 - Centro, Cidade - SP"
                                    className={inputClass}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="instagram" className={`flex items-center gap-2 ${labelClass}`}><Instagram size={14} className="text-pink-600" /> Instagram</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-400 font-medium">@</span>
                                    <Input
                                        id="instagram"
                                        value={formData.instagram}
                                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                        className={`${inputClass} pl-8`}
                                        placeholder="suabarbearia"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
