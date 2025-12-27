import { BarbershopData } from "@/types/barbershop";
import { Timestamp } from "firebase/firestore";

// Firestore Schema Definition
// Extends the application type with Firestore-specific metadata
export interface FirestoreBarbershop extends Omit<BarbershopData, 'id'> {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    ownerId: string; // Links to Firebase Auth UID

    // Status flags
    isActive: boolean;
    isPublished: boolean;

    // Search helpers
    keywords?: string[];
}

// Helper to convert Firestore data to App data
export const toAppModel = (id: string, data: any): BarbershopData => {
    return {
        ...data,
        id: id,
        // Convert Timestamps to ISO strings if needed, or keep as is if your type supports it
        // For now, assuming direct mapping for core fields
    } as BarbershopData;
};
