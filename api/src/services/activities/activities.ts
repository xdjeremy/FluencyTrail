import type { Prisma } from '@prisma/client';
import {
  differenceInCalendarDays,
  endOfDay,
  isValid,
  startOfDay,
  subDays,
  subYears,
} from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import type {
  ActivityRelationResolvers,
  MutationResolvers,
  QueryResolvers,
} from 'types/graphql';

import { RedwoodError } from '@redwoodjs/api';

import { db } from 'src/lib/db';
import { TimezoneConverter } from 'src/lib/TimezoneConverter';
import { slugify } from 'src/lib/utils/slugify';
import { MediaManager } from 'src/services/medias/mediamanager'; // Import MediaManager
import TheMovieDb from 'src/services/medias/themoviedb'; // Import TheMovieDb client

// --- Service Functions ---
export const activities: QueryResolvers['activities'] = ({
  itemsPerPage = 10,
  page = 1,
  userId = context.currentUser.id,
  languageId = null,
}) => {
  const offset = (page - 1) * itemsPerPage;

  const where: Prisma.ActivityWhereInput = { userId };
  if (languageId) {
    where.languageId = languageId;
  }

  return db.activity.findMany({
    take: itemsPerPage,
    skip: offset,
    orderBy: { date: 'desc' },
    where,
  });
};

export const activity: QueryResolvers['activity'] = ({ id }) => {
  return db.activity.findUnique({
    where: { id },
  });
};

export const heatMap: QueryResolvers['heatMap'] = async ({ languageId }) => {
  const oneYearAgo = subYears(new Date(), 1);
  const where: Prisma.ActivityWhereInput = {
    userId: context.currentUser.id,
    date: {
      gte: oneYearAgo,
    },
  };

  if (languageId) {
    where.languageId = languageId;
  }

  const activities = await db.activity.findMany({
    where,
    select: {
      date: true,
      duration: true,
    },
  });

  // Determine the user's timezone, fallback to UTC if not set
  const userTimeZone = context.currentUser?.timezone || 'UTC';

  // Aggregate durations by date using user's timezone
  const aggregatedData: { [date: string]: number } = {};
  activities.forEach(activity => {
    // Format the date according to the user's timezone using the converter
    const dateStr = TimezoneConverter.utcToUserFormat(
      activity.date,
      userTimeZone,
      'yyyy/MM/dd'
    );

    if (aggregatedData[dateStr]) {
      aggregatedData[dateStr] += activity.duration;
    } else {
      aggregatedData[dateStr] = activity.duration;
    }
  });

  // Transform the aggregated data into the desired format
  const heatMapData = Object.entries(aggregatedData).map(([date, count]) => ({
    date,
    count,
  }));

  return heatMapData;
};

export const streak: QueryResolvers['streak'] = async ({ languageId }) => {
  const userId = context.currentUser.id;
  const userTimeZone = context.currentUser?.timezone || 'UTC';

  const where: Prisma.ActivityWhereInput = { userId };
  if (languageId) {
    where.languageId = languageId;
  }

  const activities = await db.activity.findMany({
    where,
    select: { date: true },
    orderBy: { date: 'asc' },
  });

  if (activities.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Normalize dates to the start of the day in the user's timezone and get unique dates
  const uniqueActivityDays = [
    ...new Set(
      activities.map(activity => {
        // Convert DB UTC time to user's timezone, then get start of that day
        const zonedDate = toZonedTime(activity.date, userTimeZone);
        const startOfZonedDay = startOfDay(zonedDate);
        // Convert back to a comparable format (e.g., timestamp or ISO string without time)
        // Using getTime() for simple comparison
        return startOfZonedDay.getTime();
      })
    ),
  ].sort((a, b) => a - b); // Ensure timestamps are sorted numerically

  let currentStreak = 0;
  let bestStreak = 0;
  let lastActivityDayTimestamp = 0;

  if (uniqueActivityDays.length > 0) {
    currentStreak = 1; // Start with 1 if there's at least one activity day
    bestStreak = 1;
    lastActivityDayTimestamp = uniqueActivityDays[0];

    for (let i = 1; i < uniqueActivityDays.length; i++) {
      const currentDayTimestamp = uniqueActivityDays[i];
      // Convert timestamps back to Date objects for comparison
      const lastDay = new Date(lastActivityDayTimestamp);
      const currentDay = new Date(currentDayTimestamp);

      // Calculate difference in calendar days
      const diff = differenceInCalendarDays(currentDay, lastDay);

      if (diff === 1) {
        currentStreak++;
      } else if (diff > 1) {
        // Reset streak if the gap is more than 1 day
        currentStreak = 1;
      }
      // If diff is 0 (multiple activities on the same day), streak doesn't change

      bestStreak = Math.max(bestStreak, currentStreak);
      lastActivityDayTimestamp = currentDayTimestamp; // Update last activity day
    }
  }

  // Check if the streak is current (ends today or yesterday)
  if (lastActivityDayTimestamp > 0) {
    const nowInUserTz = toZonedTime(new Date(), userTimeZone);
    const lastActivityDayInUserTz = new Date(lastActivityDayTimestamp); // Already represents start of day in user's TZ

    const diffFromToday = differenceInCalendarDays(
      nowInUserTz,
      lastActivityDayInUserTz
    );

    // If the last activity day is not today (diff=0) or yesterday (diff=1), reset current streak
    if (diffFromToday > 1) {
      currentStreak = 0;
    }
  } else {
    // No activities means no current streak
    currentStreak = 0;
  }

  return { currentStreak, bestStreak };
};

export const completedToday: QueryResolvers['completedToday'] = async ({
  languageId,
}) => {
  const userId = context.currentUser.id;
  const userTimeZone = context.currentUser?.timezone || 'UTC';

  // Get current time and convert to user's timezone
  const now = new Date();
  const nowInUserTz = toZonedTime(now, userTimeZone);

  // Calculate the start and end of the current day in the user's timezone
  const startOfToday = startOfDay(nowInUserTz);
  const endOfToday = endOfDay(nowInUserTz);

  // Convert the local timezone dates to UTC for database comparison
  const utcStartOfToday = TimezoneConverter.userDateToUtc(
    startOfToday.toISOString(),
    userTimeZone
  );
  const utcEndOfToday = TimezoneConverter.userDateToUtc(
    endOfToday.toISOString(),
    userTimeZone
  );

  const where: Prisma.ActivityWhereInput = {
    userId: userId,
    date: {
      gte: utcStartOfToday,
      lte: utcEndOfToday,
    },
  };

  if (languageId) {
    where.languageId = languageId;
  }

  const count = await db.activity.count({ where });

  return count > 0;
};

export const totalTime: QueryResolvers['totalTime'] = async ({
  languageId,
}) => {
  const userId = context.currentUser.id;
  const now = new Date();

  // Define date ranges precisely
  const endOfToday = endOfDay(now);
  const startOfThisWeek = startOfDay(subDays(now, 6)); // Start of 7 days ago (inclusive of today)
  const endOfLastWeek = startOfDay(subDays(now, 7)); // End of the day 8 days ago (exclusive start of last week)
  const startOfLastWeek = startOfDay(subDays(now, 13)); // Start of 14 days ago

  // Use Prisma aggregate for efficient summation
  const baseWhere = {
    userId,
    ...(languageId ? { languageId } : {}),
  };

  const [totalDurationSum, thisWeekDurationSum, lastWeekDurationSum] =
    await Promise.all([
      db.activity.aggregate({
        _sum: { duration: true },
        where: baseWhere,
      }),
      db.activity.aggregate({
        _sum: { duration: true },
        where: {
          ...baseWhere,
          date: {
            gte: startOfThisWeek,
            lte: endOfToday,
          },
        },
      }),
      db.activity.aggregate({
        _sum: { duration: true },
        where: {
          ...baseWhere,
          date: {
            gte: startOfLastWeek,
            lt: endOfLastWeek,
          },
        },
      }),
    ]);

  const totalTime = totalDurationSum._sum.duration || 0;
  const thisWeekTotalTime = thisWeekDurationSum._sum.duration || 0;
  const lastWeekTotalTime = lastWeekDurationSum._sum.duration || 0;

  // Calculate the percentage change from last week to this week
  const vsLastWeek =
    lastWeekTotalTime === 0
      ? thisWeekTotalTime > 0
        ? 100 // Infinite increase represented as 100%
        : 0 // No change from 0 to 0
      : ((thisWeekTotalTime - lastWeekTotalTime) / lastWeekTotalTime) * 100;

  return {
    totalTime,
    vsLastWeek: Math.round(vsLastWeek),
  };
};

export const createActivity: MutationResolvers['createActivity'] = async ({
  input,
}) => {
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

  // Instantiate MediaManager
  const tmdbClient = new TheMovieDb(); // Assuming simple instantiation
  const mediaManager = new MediaManager(tmdbClient);

  let mediaId: string | undefined;
  let customMediaId: string | undefined;

  // --- Handle Media Lookup BEFORE Transaction ---
  // Media is optional, but validate if provided
  if (input.mediaSlug && input.customMediaTitle) {
    throw new RedwoodError('Cannot set both mediaSlug and customMediaTitle');
  }

  // If linking existing media, find it *before* the transaction
  if (input.mediaSlug) {
    const foundMedia = await mediaManager.getMediaBySlug(input.mediaSlug);

    if (!foundMedia) {
      throw new RedwoodError('Selected media not found');
    }

    if (foundMedia.mediaType === 'CUSTOM') {
      customMediaId = foundMedia.id; // Set ID for existing custom media
    } else if (
      foundMedia.mediaType === 'MOVIE' ||
      foundMedia.mediaType === 'TV'
    ) {
      mediaId = foundMedia.id; // Set ID for existing TMDB media
    } else {
      console.warn(`Unexpected media type found: ${foundMedia.mediaType}`);
      throw new RedwoodError('Selected media has an unsupported type');
    }
  }
  // Note: If input.customMediaTitle is provided, we handle creation *inside* the transaction

  // --- Start Transaction for Atomic Writes ---
  return await db.$transaction(async tx => {
    // If creating NEW custom media, do it inside the transaction
    if (input.customMediaTitle) {
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
      customMediaId = newCustomMedia.id; // Set ID for newly created custom media
    }

    // Parse the ISO string date from input
    const userDate = new Date(input.date);
    if (!isValid(userDate)) {
      throw new RedwoodError('Invalid date provided');
    }

    const userTimeZone = context.currentUser?.timezone || 'UTC';
    const finalDateForDb = TimezoneConverter.userDateToUtc(
      userDate.toISOString(),
      userTimeZone
    );

    // Create activity with the appropriate media reference
    return tx.activity.create({
      data: {
        activityType: input.activityType,
        notes: input.notes,
        duration: input.duration,
        date: finalDateForDb,
        userId: context.currentUser.id,
        languageId: input.languageId,
        mediaId,
        customMediaId,
      },
    });
  });
};

export const updateActivity: MutationResolvers['updateActivity'] = async ({
  id,
  input,
}) => {
  // Ensure user owns this activity
  const activity = await db.activity.findFirst({
    where: {
      id,
      userId: context.currentUser.id,
    },
  });

  if (!activity) {
    throw new RedwoodError('Activity not found');
  }

  // If changing language, validate the new language
  if (input.languageId) {
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
  }

  // Handle date conversion if date is being updated
  let finalDateForDb = undefined;
  if (input.date) {
    const userTimeZone = context.currentUser?.timezone || 'UTC';
    if (!isValid(input.date)) {
      throw new RedwoodError('Invalid date provided');
    }

    const dateString = formatInTimeZone(input.date, 'UTC', 'yyyy-MM-dd');
    finalDateForDb = TimezoneConverter.userDateToUtc(dateString, userTimeZone);
  }

  const updateData: Prisma.ActivityUpdateInput = {
    activityType: input.activityType,
    notes: input.notes,
    duration: input.duration,
    date: finalDateForDb,
    ...(input.languageId
      ? { language: { connect: { id: input.languageId } } }
      : {}),
    ...(input.mediaSlug
      ? { media: { connect: { slug: input.mediaSlug } } }
      : {}),
  };

  return db.activity.update({
    where: { id },
    data: updateData,
  });
};

export const deleteActivity: MutationResolvers['deleteActivity'] = ({ id }) => {
  const userId = context.currentUser.id;

  return db.activity.delete({
    where: { id, userId }, // Ensure the userId matches
  });
};

export const Activity: ActivityRelationResolvers = {
  user: (_obj, { root }) => {
    return db.activity.findUnique({ where: { id: root?.id } }).user();
  },
  language: (_obj, { root }) => {
    return db.activity.findUnique({ where: { id: root?.id } }).language();
  },
  media: (_obj, { root }) => {
    return db.activity.findUnique({ where: { id: root?.id } }).media();
  },
  customMedia: (_obj, { root }) => {
    return db.activity.findUnique({ where: { id: root?.id } }).customMedia();
  },
};
