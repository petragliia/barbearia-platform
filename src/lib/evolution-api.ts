// src/lib/evolution-api.ts

interface SendMessageProps {
    phone: string;
    message: string;
    instanceId?: string; // Opcional se você tiver só uma instância
}

export async function sendWhatsAppMessage({ phone, message }: SendMessageProps) {
    // Limpeza básica do telefone (remove caracteres não numéricos)
    const cleanPhone = phone.replace(/\D/g, '');

    // Adiciona o código do país se faltar (assumindo BR 55)
    const formattedPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;

    const apiKey = process.env.EVOLUTION_API_KEY;
    const apiUrl = process.env.EVOLUTION_API_URL;
    const instanceName = process.env.EVOLUTION_INSTANCE_NAME; // Ex: "MinhaInstancia"

    if (!apiKey || !apiUrl || !instanceName) {
        console.error('❌ ERRO: Variáveis de ambiente da Evolution API não configuradas.');
        return { success: false, error: 'Configuration missing' };
    }

    try {
        const response = await fetch(`${apiUrl}/message/sendText/${instanceName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': apiKey,
            },
            body: JSON.stringify({
                number: formattedPhone,
                options: {
                    delay: 1200,
                    presence: "composing",
                    linkPreview: false
                },
                textMessage: {
                    text: message
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ Falha ao enviar WhatsApp:', errorData);
            return { success: false, error: errorData };
        }

        const data = await response.json();

        return { success: true, data };

    } catch (error) {
        console.error('❌ Erro de conexão com Evolution API:', error);
        return { success: false, error };
    }
}
