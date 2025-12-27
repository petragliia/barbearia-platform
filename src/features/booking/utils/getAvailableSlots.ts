import { addMinutes, format, parse, isBefore, isAfter } from 'date-fns';

export interface BookedSlot {
    start: string; // "HH:mm"
    duration: number; // minutes
}

/**
 * Calculates available time slots for a given date.
 * 
 * @param date - The specific date to check (used for parsing context).
 * @param openTime - Opening time in "HH:mm" format (e.g., "09:00").
 * @param closeTime - Closing time in "HH:mm" format (e.g., "18:00").
 * @param serviceDuration - Duration of the service in minutes.
 * @param bookedSlots - Array of existing bookings with start time and duration.
 * @param interval - (Optional) Step in minutes between potential slots. Defaults to 30.
 * @returns Array of available start times in "HH:mm" format.
 */
export function getAvailableSlots(
    date: Date,
    openTime: string,
    closeTime: string,
    serviceDuration: number,
    bookedSlots: BookedSlot[],
    interval: number = 30
): string[] {
    const slots: string[] = [];

    // Helper to parse "HH:mm" to a Date object valid for the given day
    const parseTime = (time: string, baseDate: Date) => {
        return parse(time, 'HH:mm', baseDate);
    };

    let currentTime = parseTime(openTime, date);
    const endOfDay = parseTime(closeTime, date);

    while (isBefore(currentTime, endOfDay)) {
        const slotEnd = addMinutes(currentTime, serviceDuration);

        // Stop if the service would end after closing time
        if (isAfter(slotEnd, endOfDay)) {
            break;
        }

        // Check for collisions with existing bookings
        const isOccupied = bookedSlots.some(booking => {
            const bookingStart = parseTime(booking.start, date);
            const bookingEnd = addMinutes(bookingStart, booking.duration);

            // Overlap condition: (StartA < EndB) and (EndA > StartB)
            return isBefore(currentTime, bookingEnd) && isAfter(slotEnd, bookingStart);
        });

        if (!isOccupied) {
            slots.push(format(currentTime, 'HH:mm'));
        }

        // Move to the next potential slot
        currentTime = addMinutes(currentTime, interval);
    }

    return slots;
}
