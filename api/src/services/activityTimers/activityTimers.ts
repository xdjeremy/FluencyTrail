import { toZonedTime } from 'date-fns-tz';
import type {
  ActivityTimerRelationResolvers,
  MutationResolvers,
  QueryResolvers,
} from 'types/graphql';

import { RedwoodError } from '@redwoodjs/api';

import { db } from 'src/lib/db';
import { logger } from 'src/lib/logger';
import { slugify } from 'src/lib/utils/slugify';
import { MediaManager } from 'src/services/medias/mediamanager';
import TheMovieDb from 'src/services/medias/themoviedb';

export const activeTimer: QueryResolvers['activeTimer'] = async () => {
  return db.activityTimer.findFirst({
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

    const userTimeZone = context.currentUser?.timezone || 'UTC';
    const now = new Date();
    const nowInUserTz = toZonedTime(now, userTimeZone);

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
          startTime: nowInUserTz,
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
      return createdTimer;
    });
  };

export const ActivityTimer: ActivityTimerRelationResolvers = {
  media: (_obj, { root }) => {
    return db.activityTimer.findUnique({ where: { id: root?.id } }).media();
  },
  customMedia: (_obj, { root }) => {
    return db.activityTimer
      .findUnique({ where: { id: root?.id } })
      .customMedia();
  },
  language: (_obj, { root }) => {
    return db.activityTimer.findUnique({ where: { id: root?.id } }).language();
  },
  activity: (_obj, { root }) => {
    return db.activityTimer.findUnique({ where: { id: root?.id } }).activity();
  },
};
