import { createClient } from '@/lib/supabase/client';
import { BarbershopData } from '@/types/barbershop';

export type BarbershopInput = Pick<BarbershopData, 'name' | 'slug' | 'template_id'> & {
    owner_id?: string;
};

// Re-export specific interface if needed locally, or just use the imported one
export type { BarbershopData };

// Helper para evitar travamentos eternos
const timeout = (ms: number, message: string) =>
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));

export async function checkSlugAvailability(slug: string): Promise<boolean> {
    const supabase = createClient();

    try {
        // Competição: Quem chegar primeiro ganha (O banco ou o erro de 5s)
        const result = await Promise.race([
            supabase.from('barbershops').select('*', { count: 'exact', head: true }).eq('slug', slug),
            timeout(8000, 'Tempo limite excedido ao verificar nome. Verifique sua conexão.')
        ]) as { count: number | null; error: any };

        if (result.error) throw result.error;

        // Se count for 0, está livre.
        return result.count === 0;
    } catch (error) {
        console.error('Erro no checkSlug:', error);
        // Em caso de erro técnico, assumimos indisponível para segurança
        throw new Error('Erro de conexão ao verificar nome.');
    }
}

export async function createBarbershop(data: BarbershopInput, userId?: string): Promise<BarbershopData> {
    const supabase = createClient();

    // 1. Identificar Usuário (com timeout)
    let ownerId = userId;
    if (!ownerId) {
        const { data: userData, error: authError } = await supabase.auth.getUser();
        if (authError || !userData.user) throw new Error('Sessão expirada. Faça login novamente.');
        ownerId = userData.user.id;
    }

    // 2. Verificar Slug
    const isAvailable = await checkSlugAvailability(data.slug);
    if (!isAvailable) {
        throw new Error('Este link já está em uso.');
    }

    // 3. Inserir Barbearia (com timeout)
    const insertPromise = supabase
        .from('barbershops')
        .insert([
            {
                name: data.name,
                slug: data.slug,
                template_id: data.template_id,
                owner_id: ownerId,
                status: 'active',
                plan_tier: 'free',
                whatsapp_enabled: false
            },
        ])
        .select()
        .single();

    const { data: newBarbershop, error: insertError } = await Promise.race([
        insertPromise,
        timeout(10000, 'O banco de dados demorou para responder ao criar a loja.')
    ]) as { data: BarbershopData | null; error: any };

    if (insertError) {
        console.error('Erro Insert:', insertError);
        if (insertError.code === '23505') throw new Error('Nome já registrado.');
        if (insertError.code === '42501') throw new Error('Erro de Permissão (RLS).');
        throw new Error(`Erro ao salvar: ${insertError.message}`);
    }

    return newBarbershop as BarbershopData;
}

export async function getBarbershop(userId: string): Promise<BarbershopData | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('barbershops')
        .select('*')
        .eq('owner_id', userId)
        .single();

    if (error || !data) return null;
    return data;
}

export async function getBarbershopById(barbershopId: string): Promise<BarbershopData | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('barbershops')
        .select('*')
        .eq('id', barbershopId)
        .single();

    if (error || !data) return null;
    return data;
}

export async function updateBarbershop(barbershopId: string, updates: Partial<BarbershopData>): Promise<BarbershopData | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('barbershops')
        .update(updates)
        .eq('id', barbershopId)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateBarbershopByOwner(ownerId: string, updates: Partial<BarbershopData>) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('barbershops')
        .update(updates)
        .eq('owner_id', ownerId)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}
