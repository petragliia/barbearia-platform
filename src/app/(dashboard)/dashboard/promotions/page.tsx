import { getBarbershopByOwner } from '@/app/actions/barbershop';
import { getPromotions } from '@/app/actions/promotions';
import PromotionsList from '@/features/promotions/components/PromotionsList';
import CreatePromotionForm from '@/features/promotions/components/CreatePromotionForm';
import { productService } from '@/features/products/services/productService';
import { redirect } from 'next/navigation';

// Mock user retrieval (replace with real auth in prod)
// We assume for Dashboard page we can get the user context or use a fixed one if dev.
// Ideally, Page receives generic params but dashboard layout provides context...
// Since this is a server component, we can't use useAuth context directly.
// We need to fetch current user ID from headers/cookies ideally.
// IMPLEMENTATION_NOTE: For this task, assuming we fetch based on a hardcoded ID for dev OR client-side fetching wrapper.
// HOWEVER, best practice is Server Component fetching.
// I will create a wrapper client component for the layout refactor later.
// For now, I'll make the page fetch if I can mock the user ID, or return null if not found.

// WAIT: The prompt implies this is inside the dashboard. Dashboard usually has access to user.
// Since implementation details of auth on server are vague (Firebase client is used), 
// I will use a Client Component Wrapper for the whole page content to access `useAuth` and then fetch data via Actions.

import PromotionsPageClient from './PromotionsPageClient';

export default function PromotionsPage() {
    return <PromotionsPageClient />;
}
