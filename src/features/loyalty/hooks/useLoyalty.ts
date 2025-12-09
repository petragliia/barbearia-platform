import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase'; // Assuming centralized firebase export
import { collection, query, where, getDocs, doc, setDoc, updateDoc, increment, arrayUnion, Timestamp } from 'firebase/firestore';
import { LoyaltyCard, LoyaltyTransactionType } from '../types';
import { useAuth } from '@/features/auth/context/AuthContext';

export function useLoyalty(barbershopId: string) {
    const { userProfile } = useAuth();
    const [card, setCard] = useState<LoyaltyCard | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchCard = async () => {
        if (!userProfile?.uid || !barbershopId) return;

        try {
            setLoading(true);
            const q = query(
                collection(db, 'loyalty_cards'),
                where('userId', '==', userProfile.uid),
                where('barbershopId', '==', barbershopId)
            );

            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const data = snapshot.docs[0].data() as any;
                // Convert Firestore timestamps to Date objects if needed
                const transactions = data.transactions?.map((t: any) => ({
                    ...t,
                    date: t.date?.toDate ? t.date.toDate() : new Date(t.date)
                })) || [];

                setCard({ ...data, id: snapshot.docs[0].id, transactions } as LoyaltyCard);
            } else {
                setCard(null);
            }
        } catch (error) {
            console.error("Error fetching loyalty card:", error);
        } finally {
            setLoading(false);
        }
    };

    const addPoints = async (points: number, description: string) => {
        if (!userProfile?.uid || !barbershopId) return;

        const transactionId = crypto.randomUUID();
        const newTransaction = {
            id: transactionId,
            date: Timestamp.now(),
            type: 'EARN' as LoyaltyTransactionType,
            points,
            description
        };

        try {
            if (card) {
                // Update existing card
                const cardRef = doc(db, 'loyalty_cards', card.id);
                await updateDoc(cardRef, {
                    balance: increment(points),
                    totalEarned: increment(points),
                    lastUpdated: Timestamp.now(),
                    transactions: arrayUnion(newTransaction)
                });
            } else {
                // Create new card
                const newCardId = `${userProfile.uid}_${barbershopId}`;
                await setDoc(doc(db, 'loyalty_cards', newCardId), {
                    userId: userProfile.uid,
                    barbershopId,
                    balance: points,
                    totalEarned: points,
                    lastUpdated: Timestamp.now(),
                    transactions: [newTransaction]
                });
            }
            fetchCard(); // Refresh local state
        } catch (error) {
            console.error("Error adding loyalty points:", error);
            throw error;
        }
    };

    const redeemReward = async (cost: number, rewardName: string) => {
        if (!card || card.balance < cost) throw new Error("Saldo insuficiente");

        const transactionId = crypto.randomUUID();
        const newTransaction = {
            id: transactionId,
            date: Timestamp.now(),
            type: 'REDEEM' as LoyaltyTransactionType,
            points: -cost,
            description: `Resgate: ${rewardName}`
        };

        try {
            const cardRef = doc(db, 'loyalty_cards', card.id);
            await updateDoc(cardRef, {
                balance: increment(-cost),
                lastUpdated: Timestamp.now(),
                transactions: arrayUnion(newTransaction)
            });
            fetchCard();
        } catch (error) {
            console.error("Error redeeming reward:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchCard();
    }, [userProfile, barbershopId]);

    return {
        card,
        loading,
        addPoints,
        redeemReward,
        refresh: fetchCard
    };
}
