import { addMinutes, format, parse, isBefore, isAfter, isEqual } from 'date-fns';

/**
 * Generates time slots of a given interval between start and end times.
 * @param startTime Start time in "HH:mm" format (e.g., "09:00")
 * @param endTime End time in "HH:mm" format (e.g., "19:00")
 * @param intervalMinutes Interval in minutes (default: 30)
 * @returns Array of time strings (e.g., ["09:00", "09:30", ...])
 */
export function getSlots(startTime: string, endTime: string, intervalMinutes: number = 30): string[] {
    const slots: string[] = [];
    let current = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());

    while (isBefore(current, end)) {
        slots.push(format(current, 'HH:mm'));
        current = addMinutes(current, intervalMinutes);
    }

    return slots;
}

/**
 * Checks if a requested slot overlaps with any existing appointment.
 * @param slotTime The time of the slot to check (e.g., "14:00")
 * @param serviceDuration Duration of the service in minutes
 * @param appointments Array of existing appointments with `time` and `service.duration`
 * @returns True if overlapping, False otherwise
 */
export function isOverlapping(
    slotTime: string,
    serviceDuration: number,
    appointments: { time: string; service: { duration: string } }[]
): boolean {
    const slotStart = parse(slotTime, 'HH:mm', new Date());
    const slotEnd = addMinutes(slotStart, serviceDuration);

    return appointments.some(app => {
        const appStart = parse(app.time, 'HH:mm', new Date());
        // Parse duration string "30 min" -> 30
        const appDuration = parseInt(app.service.duration.replace(/\D/g, '')) || 30;
        const appEnd = addMinutes(appStart, appDuration);

        // Check for overlap
        // (StartA < EndB) and (EndA > StartB)
        return isBefore(slotStart, appEnd) && isAfter(slotEnd, appStart);
    });
}
