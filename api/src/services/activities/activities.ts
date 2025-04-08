import {
  differenceInCalendarDays,
  endOfDay, // Added endOfDay
  isValid, // Added isValid import
  startOfDay,
  subDays,
  subYears,
} from 'date-fns';
// Import both timezone functions we need
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import type {
  ActivityRelationResolvers,
  MutationResolvers,
  QueryResolvers,
} from 'types/graphql';

// Removed validate, validateWith

import { db } from 'src/lib/db';
import { TimezoneConverter } from 'src/lib/TimezoneConverter'; // Import the new converter

// Removed MediaManager import

// Import the validation function from the new file
import { validateActivityInput } from './activityValidation';

// --- Service Functions ---
export const activities: QueryResolvers['activities'] = () => {
  return db.activity.findMany();
};

export const activity: QueryResolvers['activity'] = ({ id }) => {
  return db.activity.findUnique({
    where: { id },
  });
};

export const heatMap: QueryResolvers['heatMap'] = async () => {
  const oneYearAgo = subYears(new Date(), 1);

  const activities = await db.activity.findMany({
    where: {
      userId: context.currentUser.id,
      date: {
        gte: oneYearAgo,
      },
    },
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

export const streak: QueryResolvers['streak'] = async () => {
  const userId = context.currentUser.id;
  const userTimeZone = context.currentUser?.timezone || 'UTC'; // Default to UTC if not set

  const activities = await db.activity.findMany({
    where: { userId },
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

export const completedToday: QueryResolvers['completedToday'] = async () => {
  const userId = context.currentUser.id;
  const userTimeZone = context.currentUser?.timezone || 'UTC'; // Default to UTC

  // Get current time and convert to user's timezone
  const now = new Date();
  const nowInUserTz = toZonedTime(now, userTimeZone);

  // Calculate the start and end of the current day in the user's timezone
  const startOfToday = startOfDay(nowInUserTz);
  const endOfToday = endOfDay(nowInUserTz);

  // Prisma stores dates in UTC, so we need to compare against the UTC equivalents
  // of the user's start/end of day.
  // Note: startOfDay/endOfDay return dates in the *local* system time, but representing
  // the correct wall-clock time in the target timezone. We don't need to convert them back to UTC
  // explicitly for Prisma comparison if the DB connection handles timezone correctly,
  // but it's safer to be explicit if unsure. Prisma typically expects ISO strings or Date objects
  // which it treats as UTC. Let's use the Date objects directly.

  const count = await db.activity.count({
    where: {
      userId: userId,
      date: {
        gte: startOfToday, // Greater than or equal to the start of the day in user's TZ
        lte: endOfToday, // Less than or equal to the end of the day in user's TZ
      },
    },
  });

  return count > 0;
};

export const totalTime: QueryResolvers['totalTime'] = async () => {
  const userId = context.currentUser.id;
  const now = new Date();

  // Define date ranges precisely
  const endOfToday = endOfDay(now);
  const startOfThisWeek = startOfDay(subDays(now, 6)); // Start of 7 days ago (inclusive of today)
  const endOfLastWeek = startOfDay(subDays(now, 7)); // End of the day 8 days ago (exclusive start of last week)
  const startOfLastWeek = startOfDay(subDays(now, 13)); // Start of 14 days ago

  // Use Prisma aggregate for efficient summation
  const [totalDurationSum, thisWeekDurationSum, lastWeekDurationSum] =
    await Promise.all([
      db.activity.aggregate({
        _sum: { duration: true },
        where: { userId },
      }),
      db.activity.aggregate({
        _sum: { duration: true },
        where: {
          userId,
          date: {
            gte: startOfThisWeek,
            lte: endOfToday,
          },
        },
      }),
      db.activity.aggregate({
        _sum: { duration: true },
        where: {
          userId,
          date: {
            gte: startOfLastWeek,
            lt: endOfLastWeek, // Use 'lt' (less than) to avoid overlap with startOfThisWeek if run exactly at midnight
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
  // Call the consolidated validation function, passing currentUser
  const { media } = await validateActivityInput(input, context.currentUser);

  // Determine the final Date object for Prisma using the TimezoneConverter
  let finalDateForDb: Date;
  const userTimeZone = context.currentUser?.timezone || 'UTC'; // Ensure timezone is available

  // input.date should be a Date object (UTC midnight) from the Date scalar
  if (!(input.date instanceof Date) || !isValid(input.date)) {
    // Defensive check, though validation should catch this
    throw new Error(
      'Invalid or unexpected date type received after validation.'
    );
  }

  try {
    // Format the Date object explicitly in UTC to get correct 'yyyy-MM-dd' string
    const dateString = formatInTimeZone(input.date, 'UTC', 'yyyy-MM-dd');
    // Convert the date string to the correct UTC timestamp representing
    // the start of the day in the user's timezone.
    finalDateForDb = TimezoneConverter.userDateToUtc(dateString, userTimeZone);
  } catch (error) {
    // Handle potential errors from formatting or the converter
    throw new Error(`Failed to process date for database: ${error.message}`);
  }

  return db.activity.create({
    data: {
      activityType: input.activityType,
      notes: input.notes,
      duration: input.duration,
      date: finalDateForDb,
      userId: context.currentUser.id,
      mediaId: media?.id, // Use the media object returned from validation
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
