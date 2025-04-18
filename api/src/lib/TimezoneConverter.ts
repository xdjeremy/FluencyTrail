import { isValid, parse, parseISO } from 'date-fns';
import { formatInTimeZone, toDate } from 'date-fns-tz';

/**
 * Provides utility functions for converting dates and times between UTC
 * (as stored in the database) and the user's local timezone.
 */
export class TimezoneConverter {
  /**
   * Converts a date string (ISO or yyyy-MM-dd format) representing a calendar date
   * in the user's timezone into a UTC Date object representing the start of that
   * day (00:00:00) in the user's timezone.
   *
   * @param dateString The date string (ISO or yyyy-MM-dd format)
   * @param timezone The user's IANA timezone name, e.g., "America/New_York"
   * @returns A Date object representing the corresponding UTC timestamp
   * @throws Error if the dateString is invalid or timezone is unrecognized
   */
  static userDateToUtc(dateString: string, timezone: string): Date {
    let parsedDate: Date;

    // Try parsing as ISO string first
    if (dateString.includes('T')) {
      parsedDate = parseISO(dateString);
    } else {
      // Parse as yyyy-MM-dd format
      parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
    }

    if (!isValid(parsedDate)) {
      throw new Error(
        `Invalid date string format: ${dateString}. Expected ISO string or yyyy-MM-dd.`
      );
    }

    // Ensure we're working with the start of day in user's timezone
    const startOfDayString = formatInTimeZone(
      parsedDate,
      timezone,
      "yyyy-MM-dd'T'00:00:00"
    );

    try {
      const utcDate = toDate(startOfDayString, { timeZone: timezone });
      if (!isValid(utcDate)) {
        throw new Error(
          `Failed to convert date "${dateString}" to UTC in timezone "${timezone}".`
        );
      }
      return utcDate;
    } catch (error) {
      if (error instanceof RangeError) {
        throw new Error(`Invalid timezone identifier: ${timezone}`);
      }
      throw error;
    }
  }

  /**
   * Formats a UTC Date object (typically from the database) into a string
   * representing the date and/or time in the user's specified timezone.
   *
   * @param utcDate The UTC Date object
   * @param timezone The user's IANA timezone name, e.g., "Europe/London"
   * @param formatString The desired output format string (using date-fns tokens)
   * @returns The formatted date/time string in the user's timezone
   * @throws Error if the timezone is unrecognized
   */
  static utcToUserFormat(
    utcDate: Date,
    timezone: string,
    formatString: string
  ): string {
    try {
      return formatInTimeZone(utcDate, timezone, formatString);
    } catch (error) {
      if (error instanceof RangeError) {
        throw new Error(`Invalid timezone identifier: ${timezone}`);
      }
      throw error;
    }
  }
}
