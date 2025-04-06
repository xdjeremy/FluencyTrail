import { ActivityType, Media } from '@prisma/client';
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
        // The value being validated (input.date) is implicitly available here.
        const dateValue = input.date;

        // Attempt to parse the date string
        const inputDate = new Date(dateValue);

        // Check 1: Is it a valid date?
        // The Date constructor returns 'Invalid Date' (which is NaN) for invalid strings.
        if (isNaN(inputDate.getTime())) {
          // Throw an error if the date string is invalid
          throw new Error(
            'Please provide a valid date format (e.g., YYYY-MM-DD).'
          );
        }

        // Check 2: Is the date in the future?
        // Get the current date (start of today in UTC for fair comparison)
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // Get the input date (start of the day in UTC)
        // We create a new Date object from the original string again,
        // or use the already parsed date, ensuring we compare dates only.
        const inputDateOnly = new Date(dateValue);
        inputDateOnly.setUTCHours(0, 0, 0, 0);

        if (inputDateOnly > today) {
          // Throw an error if the date is in the future
          throw new Error('Activity date cannot be in the future.');
        }

        // If validation fails, an error is thrown above.
        // If it reaches here, validation passes. No return needed.
      },
      // Note: The message property here is less critical when 'with' throws specific errors,
      // but can serve as a fallback or general description.
      message: 'Invalid date provided.',
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

  return db.activity.create({
    data: {
      activityType: input.activityType,
      notes: input.notes,
      duration: input.duration,
      date: input.date,
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
