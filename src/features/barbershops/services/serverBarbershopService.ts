import { dbAdmin } from "@/lib/firebase-admin";
import { BarbershopData } from "@/types/barbershop";

export const getBarbershopBySlug = async (slug: string): Promise<BarbershopData | null> => {
    try {
        const snapshot = await dbAdmin
            .collection("barbershops")
            .where("slug", "==", slug)
            .limit(1)
            .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        // Ensure to cast or validate data if needed, but per request we return simple spread
        return {
            id: doc.id,
            ...doc.data()
        } as BarbershopData;
    } catch (error) {
        console.error("Erro ao buscar barbearia:", error);
        return null;
    }
};
