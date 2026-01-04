import OpenAI from 'openai';

// Helper to safely get OpenAI instance
function getOpenAIInstance() {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

    // During build or if missing, return null safely
    if (!apiKey) return null;

    return new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    });
}

type MessageType = 'birthday' | 'win_back';
type BarberStyle = 'urban' | 'classic' | 'modern';

interface GenerateOptions {
    type: MessageType;
    customerName: string;
    description?: string; // e.g. "Last cut was 40 days ago, style: Barba Lenhador"
    barberStyle: BarberStyle;
}

export const CopywriterService = {
    generateMessage: async ({ type, customerName, description, barberStyle }: GenerateOptions): Promise<string> => {
        try {
            const openai = getOpenAIInstance();

            // Static Fallback if no key is present (Safety First)
            if (!openai) {
                console.warn('[CopywriterService] No OpenAI API Key found. Using fallback.');
                return getFallbackMessage(type, customerName);
            }

            const systemPrompt = `Você é um assistente de barbearia com estilo "${barberStyle}".
            
            Diretrizes de Estilo:
            - Classic: Formal, elegante, uso de "Prezado", "estimado", foco em tradição e cavalheirismo.
            - Urban: Descolado, uso de gírias locais (br), direto, energético. "E aí", "Mano", "Tmj".
            - Modern: Minimalista, clean, educado mas casual. Foco em estética e bem-estar.

            Objetivo: Criar uma mensagem curta de Whatsapp (max 2 frases).
            Seja amigável e persuasive.`;

            const userPrompt = `Cliente: ${customerName}.
            Contexto: ${type === 'birthday' ? 'Aniversário do cliente.' : 'Cliente sumido (Win-back).'}
            Detalhes: ${description || ''}
            
            Gere a mensagem:`;

            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 150,
                temperature: 0.7,
            });

            const message = response.choices[0]?.message?.content?.trim();
            return message || getFallbackMessage(type, customerName);

        } catch (error) {
            console.error('[CopywriterService] AI Generation failed:', error);
            return getFallbackMessage(type, customerName);
        }
    }
};

function getFallbackMessage(type: MessageType, name: string): string {
    if (type === 'birthday') {
        return `Parabéns ${name}! A barbearia te deseja mta felicidades. Venha comemorar com um trato no visual! 🎂`;
    }
    return `Olá ${name}, faz tempo que não te vemos! Que tal agendar seu próximo corte? Estamos com saudades! ✂️`;
}
