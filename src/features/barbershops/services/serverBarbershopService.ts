import { createClient } from "@/lib/supabase/client"; // Use client - this is likely a read operation which can be public
import { BarbershopData } from "@/types/barbershop";

// Note: If this runs on the server, we might want createClient from @/lib/supabase/server
// BUT, getBarbershopBySlug is likely used in generateMetadata or Page Server Component for public access.
// We can use a basic client or the server one. Since we don't need cookies for PUBLIC data (slug lookup), 
// a simple client with ANON key is usually enough IF RLS allows 'select' for public.
// Assuming 'barbershops' table is public read.

// To be safe and consistent with Next.js Server Components, let's use the standard client 
// but we might need to handle the case where it's being called.
import { createClient as createServerClient } from '@/lib/supabase/server';

export const getBarbershopBySlug = async (slug: string): Promise<BarbershopData | null> => {
    try {
        const supabase = await createServerClient();

        const { data, error } = await supabase
            .from("barbershops")
            .select("*")
            .eq("slug", slug)
            .single();

        if (error || !data) return null;

        // Map snake_case to camelCase
        return {
            ...data,
            id: data.id,
            // Map other fields from DB structure to BarbershopData interface
            ownerId: data.owner_id,
            isPublished: data.is_published,
            createdAt: data.created_at,
            template_id: data.template_id,
        } as BarbershopData;
    } catch (error) {
        console.error("Erro ao buscar barbearia:", error);
        return null;
    }
};
