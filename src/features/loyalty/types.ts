export interface LoyaltyConfig {
    enabled: boolean;
    pointsPerService: number;
    pointsRequired: number;
    rewardName: string;
}

export type LoyaltyTransactionType = 'EARN' | 'REDEEM' | 'ADJUSTMENT';

export interface LoyaltyTransaction {
    id: string;
    date: Date; // Firestore Timestamp converted to Date
    type: LoyaltyTransactionType;
    points: number;
    description: string;
}

export interface LoyaltyCard {
    id: string;
    userId: string;
    barbershopId: string;
    balance: number;
    totalEarned: number;
    transactions: LoyaltyTransaction[];
    lastUpdated?: Date;
}
