import { createClient } from '@/lib/supabase/client';
import { Barber } from '../types';

export class TeamService {
    private static supabase = createClient();

    /**
     * Fetches all professionals for a specific barbershop.
     */
    static async getProfessionals(barbershopId: string): Promise<Barber[]> {
        const { data, error } = await this.supabase
            .from('professionals')
            .select('*')
            .eq('barbershop_id', barbershopId);

        if (error) {
            console.error("TeamService.getProfessionals error:", JSON.stringify(error, null, 2));
            throw new Error(`Failed to fetch professionals: ${error.message}`);
        }

        return (data || []).map(mapToDomain);
    }

    /**
     * Creates a new professional.
     */
    static async createProfessional(barber: Omit<Barber, 'id'>): Promise<void> {
        const dbPayload = mapToPersistence(barber);

        const { error } = await this.supabase
            .from('professionals')
            .insert([dbPayload]);

        if (error) {
            console.error("TeamService.createProfessional error:", error);
            throw new Error(error.message || "Failed to create professional");
        }
    }

    /**
     * Updates an existing professional.
     */
    static async updateProfessional(barber: Barber): Promise<void> {
        const dbPayload = mapToPersistence(barber);

        // Remove ID from payload as it's the selector
        // (Though Supabase ignores it typically if not primary key change, cleaner to remove)
        const { id, ...updates } = dbPayload;

        const { error } = await this.supabase
            .from('professionals')
            .update(updates)
            .eq('id', barber.id);

        if (error) {
            console.error("TeamService.updateProfessional error:", error);
            throw new Error(error.message || "Failed to update professional");
        }
    }

    /**
     * Deletes a professional.
     */
    static async deleteProfessional(barberId: string): Promise<void> {
        const { error } = await this.supabase
            .from('professionals')
            .delete()
            .eq('id', barberId);

        if (error) {
            console.error("TeamService.deleteProfessional error:", error);
            throw new Error(error.message || "Failed to delete professional");
        }
    }

    /**
     * Toggles the active status of a professional.
     */
    static async toggleActive(barberId: string, isActive: boolean): Promise<void> {
        const { error } = await this.supabase
            .from('professionals')
            .update({ active: isActive })
            .eq('id', barberId);

        if (error) {
            console.error("TeamService.toggleActive error:", error);
            throw new Error(error.message || "Failed to update status");
        }
    }
}

// Helper functions to map between Domain (CamelCase) and Persistence (SnakeCase)

function mapToDomain(dbRecord: any): Barber {
    return {
        id: dbRecord.id,
        name: dbRecord.name,
        specialty: dbRecord.specialty,
        phone: dbRecord.phone,
        photoUrl: dbRecord.photo_url,
        active: dbRecord.active,
        barbershopId: dbRecord.barbershop_id,
        email: dbRecord.email
    };
}

function mapToPersistence(barber: Partial<Barber>) {
    return {
        ...(barber.id && { id: barber.id }),
        name: barber.name,
        specialty: barber.specialty,
        phone: barber.phone,
        photo_url: barber.photoUrl,
        active: barber.active,
        barbershop_id: barber.barbershopId,
        email: barber.email
    };
}
