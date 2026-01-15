
import { useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { useEditor } from '@/features/editor/hooks/useEditor';

export function useSaveTheme() {
    const { user } = useAuth();
    const { data } = useEditor();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const saveChanges = async (isPublished: boolean = true) => {
        if (!user || !data) return { success: false, error: 'No user or data' };

        setSaving(true);
        setError(null);

        try {
            // Prepare payload ensuring isPublished is set
            const payload = {
                ...data,
                is_published: isPublished // Mapping to snake_case
            };

            // Remove camelCase fields if they are just local mappings, or keep them if JSONB handles it.
            // Ideally we map back to DB schema.
            // For now, assuming standard columns or JSONB 'content' column?
            // "data" in useEditor likely contains the whole barbershop object.
            // If the table is structured, we should update specific columns.
            // Reviewing BarbershopData interface: it has structure.

            // Let's assume we are updating the row matching the user's ID (owner_id or id?).
            // The previous code used `doc(db, 'barbershops', user.uid)`, implying user.uid IS the doc ID.

            // We need to map `data` back to snake_case row if strict schema, or just pass if loose.
            // Let's do a partial update of relevant fields.

            const updateData: any = {
                is_published: isPublished,
                // Map other root fields if 'data' has them edited
                // content: ...
            };

            if (data.content) updateData.content = data.content;
            if (data.name) updateData.name = data.name;
            if (data.slug) updateData.slug = data.slug;
            // ... map others

            const { error: updateError } = await supabase
                .from('barbershops')
                .update(updateData)
                .eq('id', user.id); // Supabase User uses 'id'
            // If ID is different, we should use data.id if trusted, or lookup by owner_id

            if (updateError) throw updateError;

            return { success: true };
        } catch (err: any) {
            console.error('Error saving theme:', err);
            setError(err.message || 'Error saving changes');
            return { success: false, error: err.message };
        } finally {
            setSaving(false);
        }
    };

    return { saveChanges, saving, error };
}
