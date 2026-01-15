import { useAuth } from '@/features/auth/context/AuthContext';
import { canUser, FeatureKey, getLimit, PlanTier } from '@/config/plans';

export function usePermission() {
    const { userProfile, loading } = useAuth();

    // Default to FREE plan if profile not loaded yet or no plan set
    const currentPlan: PlanTier = userProfile?.plan || 'FREE';

    const can = (feature: Exclude<FeatureKey, 'maxServices'>) => {
        if (loading) return false; // Fail safe loading state
        return canUser(currentPlan, feature);
    };

    const limit = (limitKey: 'maxServices') => {
        return getLimit(currentPlan, limitKey);
    };

    return {
        plan: currentPlan,
        can,
        limit,
        loading
    };
}
