import { useAuth } from '@/features/auth/context/AuthContext';

export function useFeatureAccess(feature: string) {
    const { userProfile } = useAuth();

    if (!userProfile) return false;

    // Admins or Pro users might have access to everything, but for now we check addons
    // If we want to give access to 'pro' users automatically:
    // if (userProfile.level === 'pro') return true;

    return userProfile.addons?.includes(feature) || false;
}
