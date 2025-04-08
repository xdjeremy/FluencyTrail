import { isValid, parse } from 'date-fns'; // Import necessary date-fns functions
import { formatInTimeZone, toDate } from 'date-fns-tz'; // Use toDate instead of zonedTimeToUtc

/**
 * Provides utility functions for converting dates and times between UTC
 * (as stored in the database) and the user's local timezone.
 */
export class TimezoneConverter {
  /**
   * Converts a date string (assumed to be in 'yyyy-MM-dd' format) representing
   * a calendar date in the user's timezone into a UTC Date object representing
   * the start of that day (00:00:00) in the user's timezone.
   *
   * @param dateString The date string, e.g., "2025-04-09".
   * @param timezone The user's IANA timezone name, e.g., "America/New_York".
   * @returns A Date object representing the corresponding UTC timestamp.
   * @throws Error if the dateString is invalid or timezone is unrecognized.
   */
  static userDateToUtc(dateString: string, timezone: string): Date {
    // Basic validation of the date string format
    const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
    if (!isValid(parsedDate)) {
      throw new Error(
        `Invalid date string format: ${dateString}. Expected yyyy-MM-dd.`
      );
    }

    // Combine date string with start of day time.
    const dateTimeString = `${dateString}T00:00:00`;

    // Use toDate to parse the string, interpreting it in the user's timezone,
    // and return the corresponding UTC Date object.
    try {
      const utcDate = toDate(dateTimeString, { timeZone: timezone });
      // Check if the resulting date is valid, as toDate might return Invalid Date
      if (!isValid(utcDate)) {
        // This might happen if the timezone is valid but the date/time combination is ambiguous
        // or invalid within that timezone (e.g., during DST transitions).
        throw new Error(
          `Failed to convert date string "${dateString}" to UTC in timezone "${timezone}". Result was an invalid date.`
        );
      }
      return utcDate;
    } catch (error) {
      // Catch potential errors from date-fns-tz if timezone is invalid (RangeError)
      if (error instanceof RangeError) {
        throw new Error(`Invalid timezone identifier: ${timezone}`);
      }
      // Re-throw other unexpected errors
      throw error;
    }
  }

  /**
   * Formats a UTC Date object (typically from the database) into a string
   * representing the date and/or time in the user's specified timezone.
   *
   * @param utcDate The UTC Date object.
   * @param timezone The user's IANA timezone name, e.g., "Europe/London".
   * @param formatString The desired output format string (using date-fns tokens), e.g., "yyyy/MM/dd".
   * @returns The formatted date/time string in the user's timezone.
   * @throws Error if the timezone is unrecognized.
   */
  static utcToUserFormat(
    utcDate: Date,
    timezone: string,
    formatString: string
  ): string {
    try {
      return formatInTimeZone(utcDate, timezone, formatString);
    } catch (error) {
      // Catch potential errors from date-fns-tz if timezone is invalid
      if (error instanceof RangeError) {
        throw new Error(`Invalid timezone identifier: ${timezone}`);
      }
      // Re-throw other unexpected errors
      throw error;
    }
  }
}
