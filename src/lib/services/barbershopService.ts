import { db } from '@/lib/firebase';
import { collection, doc, getDocs, query, setDoc, where, Timestamp } from 'firebase/firestore';
import { BarbershopData } from '@/types/barbershop';

export async function createBarbershop(data: BarbershopData, userId: string): Promise<string> {
    const barbershopsRef = collection(db, 'barbershops');

    // 1. Verificação de Unicidade do Slug
    const q = query(barbershopsRef, where('slug', '==', data.slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        throw new Error('Esta URL já está em uso. Por favor, escolha outra.');
    }

    // 2. Gravação
    // Usando userId como ID do documento para facilitar (1 barbearia por usuário por enquanto)
    // Ou podemos usar um ID gerado: const newDocRef = doc(barbershopsRef);

    // Vamos usar um ID gerado automaticamente para permitir que um usuário tenha múltiplas barbearias no futuro,
    // mas salvando o ownerId.
    const newDocRef = doc(barbershopsRef);

    const barbershopToSave = {
        ...data,
        id: newDocRef.id, // Sobrescreve o ID temporário
        ownerId: userId,
        createdAt: Timestamp.now(),
        status: 'active', // Inicialmente active para testes
    };

    await setDoc(newDocRef, barbershopToSave);

    return data.slug;
}

export async function getBarbershop(userId: string): Promise<BarbershopData | null> {
    const barbershopsRef = collection(db, 'barbershops');
    const q = query(barbershopsRef, where('ownerId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    // Return the first one found (assuming 1 shop per user for now)
    const docData = querySnapshot.docs[0].data();
    return docData as BarbershopData;
}

export async function updateBarbershop(barbershopId: string, data: Partial<BarbershopData>): Promise<void> {
    const docRef = doc(db, 'barbershops', barbershopId);
    // We need to import updateDoc
    const { updateDoc } = await import('firebase/firestore');
    await updateDoc(docRef, data);
}
