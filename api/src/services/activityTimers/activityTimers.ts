import { differenceInSeconds } from 'date-fns';
import type {
  ActivityTimerRelationResolvers,
  MutationResolvers,
  QueryResolvers,
} from 'types/graphql';

import { RedwoodError } from '@redwoodjs/api';

import { db } from 'src/lib/db';
import { logger } from 'src/lib/logger';
import { TimezoneConverter } from 'src/lib/TimezoneConverter';
import { slugify } from 'src/lib/utils/slugify';
import { MediaManager } from 'src/services/medias/mediamanager';
import TheMovieDb from 'src/services/medias/themoviedb';

export const activeTimer: QueryResolvers['activeTimer'] = async () => {
  const timer = await db.activityTimer.findFirst({
    where: {
      endTime: null,
      userId: context.currentUser.id,
    },
    orderBy: { startTime: 'desc' },
    include: {
      media: true,
      customMedia: true,
      language: true,
    },
  });

  if (!timer) return null;

  const userTimeZone = context.currentUser.timezone;
  const userTzStartTime = new Date(
    TimezoneConverter.utcToUserFormat(
      timer.startTime,
      userTimeZone,
      "yyyy-MM-dd'T'HH:mm:ss"
    )
  );

  let userTzEndTime = null;
  if (timer.endTime) {
    userTzEndTime = new Date(
      TimezoneConverter.utcToUserFormat(
        timer.endTime,
        userTimeZone,
        "yyyy-MM-dd'T'HH:mm:ss"
      )
    );
  }

  return {
    ...timer,
    startTime: userTzStartTime,
    endTime: userTzEndTime,
  };
};

export const startActivityTimer: MutationResolvers['startActivityTimer'] =
  async ({ input }) => {
    // Validate language exists and user has access to it
    if (!input.languageId) {
      throw new RedwoodError('Language is required');
    }

    const user = await db.user.findUnique({
      where: {
        id: context.currentUser.id,
      },
      select: {
        languages: {
          where: { id: input.languageId },
        },
      },
    });

    if (!user?.languages?.length) {
      throw new RedwoodError('Selected language is not added to your profile');
    }

    // Check for active timer
    const activeTimer = await db.activityTimer.findFirst({
      where: {
        endTime: null,
        userId: context.currentUser.id,
      },
    });

    if (activeTimer) {
      throw new RedwoodError('You already have an active timer');
    }

    // Instantiate MediaManager
    const tmdbClient = new TheMovieDb();
    const mediaManager = new MediaManager(tmdbClient);

    let mediaId: string | undefined;
    let customMediaId: string | undefined;

    // Media validation
    if (input.mediaSlug && input.customMediaTitle) {
      throw new RedwoodError('Cannot set both mediaSlug and customMediaTitle');
    }

    // If linking existing media, find it before the transaction
    if (input.mediaSlug) {
      const foundMedia = await mediaManager.getMediaBySlug(input.mediaSlug);
      logger.info({ foundMedia }, 'Found media by slug'); // Log 1

      if (!foundMedia) {
        throw new RedwoodError('Selected media not found');
      }

      if (foundMedia.mediaType === 'CUSTOM') {
        customMediaId = foundMedia.id;
      } else if (
        foundMedia.mediaType === 'MOVIE' ||
        foundMedia.mediaType === 'TV'
      ) {
        mediaId = foundMedia.id;
      } else {
        console.warn(`Unexpected media type found: ${foundMedia.mediaType}`);
        throw new RedwoodError('Selected media has an unsupported type');
      }
    }

    const now = new Date(); // Store in UTC
    logger.info({ mediaId, customMediaId }, 'IDs before transaction'); // Log 2

    // Start transaction for atomic writes
    return await db.$transaction(async tx => {
      // If creating NEW custom media, do it inside the transaction
      if (input.customMediaTitle) {
        if (!input.customMediaTitle.trim()) {
          throw new RedwoodError('Custom media title cannot be empty');
        }
        const existing = await tx.customMedia.findFirst({
          where: {
            userId: context.currentUser.id,
            title: input.customMediaTitle,
          },
        });

        if (existing) {
          throw new RedwoodError('You already have a media with this title');
        }

        const slug = `${slugify(input.customMediaTitle)}-${Math.random()
          .toString(36)
          .slice(2, 6)}`;

        const newCustomMedia = await tx.customMedia.create({
          data: {
            title: input.customMediaTitle,
            slug,
            userId: context.currentUser.id,
          },
        });
        customMediaId = newCustomMedia.id;
      }

      logger.info(
        { mediaId, customMediaId },
        'IDs inside transaction, before create'
      ); // Log 3

      const createdTimer = await tx.activityTimer.create({
        data: {
          startTime: now,
          endTime: null,
          activityType: input.activityType,
          userId: context.currentUser.id,
          languageId: input.languageId,
          mediaId,
          customMediaId,
        },
        include: {
          media: true,
          customMedia: true,
          language: true,
        },
      });

      logger.info({ createdTimer }, 'Created timer object'); // Log 4

      const userTimeZone = context.currentUser.timezone;
      const userTzStartTime = new Date(
        TimezoneConverter.utcToUserFormat(
          createdTimer.startTime,
          userTimeZone,
          "yyyy-MM-dd'T'HH:mm:ss"
        )
      );

      return {
        ...createdTimer,
        startTime: userTzStartTime,
        endTime: null,
      };
    });
  };

export const stopActivityTimer: MutationResolvers['stopActivityTimer'] =
  async ({ input }) => {
    const timer = await db.activityTimer.findFirst({
      where: {
        id: input.id,
        userId: context.currentUser.id,
        endTime: null,
      },
    });

    if (!timer) {
      throw new RedwoodError('Timer not found or already stopped');
    }

    return await db.$transaction(async tx => {
      const transactionNow = new Date(); // Create timestamp inside transaction

      // Update the timer
      const updatedTimer = await tx.activityTimer.update({
        where: { id: timer.id },
        data: { endTime: transactionNow },
        include: {
          media: true,
          customMedia: true,
          language: true,
        },
      });

      // Fetch fresh timestamps from DB to ensure accuracy
      const freshTimer = await tx.activityTimer.findUnique({
        where: { id: timer.id },
        select: { startTime: true, endTime: true },
      });

      if (!freshTimer || !freshTimer.endTime) {
        throw new RedwoodError('Failed to retrieve timer timestamps');
      }

      // Validate media references if present
      if (updatedTimer.mediaId) {
        const mediaExists = await tx.media.findUnique({
          where: { id: updatedTimer.mediaId },
        });
        if (!mediaExists) {
          throw new RedwoodError('Linked media no longer exists');
        }
      }

      if (updatedTimer.customMediaId) {
        const customMediaExists = await tx.customMedia.findUnique({
          where: { id: updatedTimer.customMediaId },
        });
        if (!customMediaExists) {
          throw new RedwoodError('Custom media no longer exists');
        }
      }

      // Calculate duration in minutes, rounding up partial minutes
      const durationSeconds = differenceInSeconds(
        freshTimer.endTime,
        freshTimer.startTime
      );
      const durationMinutes = Math.ceil(durationSeconds / 60);

      logger.info(
        {
          startTime: freshTimer.startTime,
          endTime: freshTimer.endTime,
          durationSeconds,
          durationMinutes,
        },
        'Timer duration calculation'
      );

      if (durationMinutes < 1) {
        throw new RedwoodError('Timer duration must be at least 1 minute');
      }

      // Create the activity record
      await tx.activity.create({
        data: {
          activityType: updatedTimer.activityType,
          duration: durationMinutes,
          date: updatedTimer.endTime,
          userId: context.currentUser.id,
          languageId: updatedTimer.languageId,
          mediaId: updatedTimer.mediaId,
          customMediaId: updatedTimer.customMediaId,
        },
      });

      // Convert times to user timezone for response
      const userTimeZone = context.currentUser.timezone;
      const userTzStartTime = new Date(
        TimezoneConverter.utcToUserFormat(
          updatedTimer.startTime,
          userTimeZone,
          "yyyy-MM-dd'T'HH:mm:ss"
        )
      );

      const userTzEndTime = new Date(
        TimezoneConverter.utcToUserFormat(
          updatedTimer.endTime,
          userTimeZone,
          "yyyy-MM-dd'T'HH:mm:ss"
        )
      );

      return {
        ...updatedTimer,
        startTime: userTzStartTime,
        endTime: userTzEndTime,
      };
    });
  };

export const ActivityTimer: ActivityTimerRelationResolvers = {
  media: async (_args, { root }) => {
    return db.activityTimer.findUnique({ where: { id: root?.id } }).media();
  },
  customMedia: async (_args, { root }) => {
    return db.activityTimer
      .findUnique({ where: { id: root?.id } })
      .customMedia();
  },
  language: async (_args, { root }) => {
    return db.activityTimer.findUnique({ where: { id: root?.id } }).language();
  },
  activity: async (_args, { root }) => {
    return db.activityTimer.findUnique({ where: { id: root?.id } }).activity();
  },
};
