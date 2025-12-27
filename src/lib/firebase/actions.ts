import { db } from "@/lib/firebase";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    collection,
    query,
    where,
    getDocs
} from "firebase/firestore";
import { BarbershopData } from "@/types/barbershop";
import { FirestoreBarbershop } from "./types";

const COLLECTION_NAME = "barbershops";

/**
 * Saves or updates the barbershop data.
 * Merges with existing data to prevent overwriting unrelated fields.
 */
export async function saveBarbershop(uid: string, data: Partial<BarbershopData>) {
    try {
        if (!uid) throw new Error("User UID is required");

        const docRef = doc(db, COLLECTION_NAME, uid); // Using UID as Document ID for 1:1 mapping

        const payload = {
            ...data,
            updatedAt: serverTimestamp(),
            ownerId: uid
        };

        // Remove undefined fields to avoid Firestore errors
        Object.keys(payload).forEach(key =>
            (payload as any)[key] === undefined && delete (payload as any)[key]
        );

        await setDoc(docRef, payload, { merge: true });
        return { success: true };
    } catch (error) {
        console.error("Error saving barbershop:", error);
        throw error;
    }
}

/**
 * Fetches the barbershop data for a given user.
 */
export async function getBarbershop(uid: string): Promise<BarbershopData | null> {
    try {
        const docRef = doc(db, COLLECTION_NAME, uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data() as FirestoreBarbershop;
            return {
                ...data,
                id: docSnap.id,
            } as unknown as BarbershopData;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching barbershop:", error);
        throw error;
    }
}

/**
 * Finds a barbershop by its slug (for public page rendering).
 */
export async function getBarbershopBySlug(slug: string): Promise<BarbershopData | null> {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("slug", "==", slug),
            where("isPublished", "==", true)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return {
                id: doc.id,
                ...doc.data()
            } as unknown as BarbershopData;
        }

        return null;
    } catch (error) {
        console.error("Error fetching by slug:", error);
        throw error;
    }
}

/**
 * Publishes the site (sets isPublished to true).
 */
export async function publishSite(uid: string) {
    const docRef = doc(db, COLLECTION_NAME, uid);
    await updateDoc(docRef, {
        isPublished: true,
        updatedAt: serverTimestamp()
    });
}
