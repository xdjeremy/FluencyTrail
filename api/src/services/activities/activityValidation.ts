import { ActivityType, Media } from '@prisma/client';
import { isValid } from 'date-fns'; // Removed parse and format
import { formatInTimeZone } from 'date-fns-tz'; // Removed utcToZonedTime/toZonedTime as it's not needed here
import type { CreateActivityInput } from 'types/graphql';

import { validate, validateWith } from '@redwoodjs/api'; // Remove context import
import type { CurrentUser } from '@redwoodjs/auth'; // Import CurrentUser type

// Assuming MediaManager is correctly located relative to this new file path
// Adjust the import path if necessary
import { MediaManager } from '../medias/mediamanager';

export const validateActivityInput = async (
  input: CreateActivityInput,
  currentUser: CurrentUser // Accept currentUser as argument
): Promise<{ media: Media | null }> => {
  // Date Validation
  validate(input.date, 'Date', {
    presence: true,
    custom: {
      with: () => {
        const dateValue = input.date; // This should now be a Date object from the scalar

        // Check if it's a valid Date object
        if (!(dateValue instanceof Date) || !isValid(dateValue)) {
          // The Date scalar should handle basic validation, but check just in case
          throw new Error('Invalid Date object received.');
        }

        // Timezone-aware future date check
        const userTimeZone = currentUser?.timezone || 'UTC'; // Use passed-in currentUser

        // Format the incoming Date object (likely UTC midnight) into 'yyyy-MM-dd'
        // *as it would appear in the user's timezone*.
        // Note: formatInTimeZone handles the conversion correctly.
        const inputDateStrInUserTz = formatInTimeZone(
          dateValue,
          userTimeZone,
          'yyyy-MM-dd'
        );

        // Get today's date string *in the user's timezone*
        const todayStrInUserTz = formatInTimeZone(
          new Date(), // Current moment
          userTimeZone,
          'yyyy-MM-dd' // Format as date string in user's TZ
        );

        // Compare the date strings representing the calendar date in the user's timezone
        if (inputDateStrInUserTz > todayStrInUserTz) {
          throw new Error('Activity date cannot be in the future.');
        }
      }, // End of custom.with function
    },
  });

  // ActivityType Validation
  validate(input.activityType, 'Activity Type', {
    presence: true,
    inclusion: { in: Object.values(ActivityType) },
  });

  // Duration Validation
  validate(input.duration, 'Duration', {
    presence: true,
    numericality: {
      greaterThanOrEqualTo: 1,
      lessThanOrEqualTo: 1440,
      message: 'Duration must be between 1 and 1440 minutes (24 hours)',
    },
  });

  // Notes Validation
  validate(input.notes, 'Notes', {
    length: { maximum: 300, message: 'Notes must be 300 characters or less' },
  });

  // Media Validation (using validateWith)
  let media = null;
  const mediaManager = new MediaManager();
  await validateWith(async () => {
    if (!input.mediaSlug) {
      return; // No slug, no validation needed, media remains null
    }
    media = await mediaManager.getMediaBySlug(input.mediaSlug);
    if (!media) {
      throw new Error('Media not found');
    }
  });

  return { media }; // Return the found media object (or null)
};
