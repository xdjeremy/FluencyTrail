import { ActivityType, Media } from '@prisma/client';
import { parse, isValid, isAfter, startOfToday } from 'date-fns';
import type { CreateActivityInput } from 'types/graphql';

import { validate, validateWith } from '@redwoodjs/api';

// Assuming MediaManager is correctly located relative to this new file path
// Adjust the import path if necessary
import MediaManager from '../medias/mediamanager';

export const validateActivityInput = async (
  input: CreateActivityInput
): Promise<{ media: Media | null }> => {
  // Date Validation
  validate(input.date, 'Date', {
    presence: true,
    custom: {
      with: () => {
        const dateValue = input.date;
        let parsedDate: Date;
        let checkDate: Date;

        if (typeof dateValue === 'string') {
          parsedDate = parse(dateValue, 'yyyy-MM-dd', new Date());
          checkDate = parsedDate;
          if (!isValid(parsedDate)) {
            throw new Error(
              'Please provide a valid date format (e.g., YYYY-MM-DD).'
            );
          }
        } else if (dateValue instanceof Date) {
          checkDate = dateValue;
          if (!isValid(checkDate)) {
            throw new Error('Invalid Date object provided.');
          }
        } else {
          throw new Error('Date must be a string (YYYY-MM-DD) or Date object.');
        }

        if (isAfter(checkDate, startOfToday())) {
          throw new Error('Activity date cannot be in the future.');
        }
      },
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
  let media: Media | null = null;
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
