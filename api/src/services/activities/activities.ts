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
      with() {
        const date = new Date(input.date);
        return date <= new Date();
      },
      message: 'Date cannot be in the future',
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
