
import { z } from 'zod';

export const CreateAppointmentSchema = z.object({
    barbershopId: z.string().uuid("ID da barbearia inválido"),
    clientId: z.string().uuid("ID do cliente inválido").optional().nullable(),
    professionalId: z.string().uuid("ID do profissional inválido").optional().nullable(),
    clientName: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    clientPhone: z.string().min(10, "Telefone inválido"),
    serviceName: z.string().min(2, "Serviço obrigatório"),
    price: z.number().min(0, "Preço inválido"),
    date: z.string().datetime("Data inválida"), // ISO string
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida (HH:MM)")
});

export type CreateAppointmentDTO = z.infer<typeof CreateAppointmentSchema>;
