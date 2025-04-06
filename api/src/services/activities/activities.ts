import { ActivityType, Media } from '@prisma/client';
import { parse, isValid, isAfter, startOfToday } from 'date-fns'; // Import date-fns functions
import type {
  ActivityRelationResolvers,
  MutationResolvers,
  QueryResolvers,
} from 'types/graphql';

import { validate, validateWith } from '@redwoodjs/api';

import { db } from 'src/lib/db';

import MediaManager from '../medias/mediamanager';

export const activities: QueryResolvers['activities'] = () => {
  return db.activity.findMany();
};

export const activity: QueryResolvers['activity'] = ({ id }) => {
  return db.activity.findUnique({
    where: { id },
  });
};

export const createActivity: MutationResolvers['createActivity'] = async ({
  input,
}) => {
  // validation
  validate(input.date, 'Date', {
    presence: true,
    custom: {
      with: () => {
        const dateValue = input.date;
        let parsedDate: Date;
        let checkDate: Date; // Date object to use for checks

        if (typeof dateValue === 'string') {
          // Strict parsing against YYYY-MM-DD format if input is string
          parsedDate = parse(dateValue, 'yyyy-MM-dd', new Date());
          checkDate = parsedDate; // Use the parsed date for checks

          // Check 1a: Is the string format valid AND does it represent a real date?
          if (!isValid(parsedDate)) {
            throw new Error(
              'Please provide a valid date format (e.g., YYYY-MM-DD).'
            );
          }
        } else if (dateValue instanceof Date) {
          // If input is already a Date object
          checkDate = dateValue; // Use the input date directly for checks

          // Check 1b: Is the Date object itself valid?
          if (!isValid(checkDate)) {
            // Should ideally not happen if coming from Prisma scenario, but good practice
            throw new Error('Invalid Date object provided.');
          }
        } else {
          // Handle unexpected types
          throw new Error('Date must be a string (YYYY-MM-DD) or Date object.');
        }

        // Check 2: Is the valid date in the future (after start of today)?
        // Use checkDate which is guaranteed to be a valid Date object here
        if (isAfter(checkDate, startOfToday())) {
          throw new Error('Activity date cannot be in the future.');
        }
        // No return needed, errors are thrown if invalid
      },
      // REMOVED generic message property
    },
  });
  validate(input.activityType, 'Activity Type', {
    presence: true,
    inclusion: {
      in: Object.values(ActivityType),
    },
  });
  validate(input.duration, 'Duration', {
    presence: true,
    numericality: {
      greaterThanOrEqualTo: 1,
      lessThanOrEqualTo: 1440,
      message: 'Duration must be between 1 and 1440 minutes (24 hours)',
    },
  });
  validate(input.notes, 'Notes', {
    length: {
      maximum: 300,
      message: 'Notes must be 300 characters or less',
    },
  });

  let media: Media | null;

  const mediaManager = new MediaManager();
  await validateWith(async () => {
    // if media is NOT provided, skip validation
    if (!input.mediaSlug) {
      return true;
    }

    media = await mediaManager.getMediaBySlug(input.mediaSlug);
    if (!media) {
      throw new Error('Media not found');
    }
  });

  // Determine the final Date object for Prisma based on input type
  let finalDateForDb: Date;
  if (typeof input.date === 'string') {
    // Parse the validated string again
    finalDateForDb = parse(input.date, 'yyyy-MM-dd', new Date());
  } else if (input.date instanceof Date) {
    // Use the validated Date object directly
    finalDateForDb = input.date;
  } else {
    // This case should technically be caught by validation, but defensively:
    throw new Error(
      'Unexpected type for date field during database preparation.'
    );
  }
  // Optional: Set to start of day UTC if that's the desired storage format
  // finalDateForDb.setUTCHours(0, 0, 0, 0);

  return db.activity.create({
    data: {
      activityType: input.activityType,
      notes: input.notes,
      duration: input.duration,
      date: finalDateForDb, // Pass the JS Date object
      userId: context.currentUser.id,
      mediaId: media?.id,
    },
  });
};

export const updateActivity: MutationResolvers['updateActivity'] = ({
  id,
  input,
}) => {
  return db.activity.update({
    data: input,
    where: { id },
  });
};

export const deleteActivity: MutationResolvers['deleteActivity'] = ({ id }) => {
  return db.activity.delete({
    where: { id },
  });
};

export const Activity: ActivityRelationResolvers = {
  user: (_obj, { root }) => {
    return db.activity.findUnique({ where: { id: root?.id } }).user();
  },
};
