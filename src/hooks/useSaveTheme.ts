
import { useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useEditor } from './useEditor';

export function useSaveTheme() {
    const { user } = useAuth();
    const { data } = useEditor();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveChanges = async (isPublished: boolean = true) => {
        if (!user || !data) return { success: false, error: 'No user or data' };

        setSaving(true);
        setError(null);

        try {
            const docRef = doc(db, 'barbershops', user.uid);

            // Prepare payload ensuring isPublished is set
            const payload = {
                ...data,
                isPublished: isPublished
            };

            await updateDoc(docRef, payload as any);
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
