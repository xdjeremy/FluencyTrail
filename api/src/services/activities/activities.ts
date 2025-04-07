import {
  parse,
  subYears,
  differenceInCalendarDays,
  startOfDay,
} from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz'; // Import timezone formatter and helpers
import type {
  ActivityRelationResolvers,
  MutationResolvers,
  QueryResolvers,
} from 'types/graphql';

// Removed validate, validateWith

import { db } from 'src/lib/db';

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
  // TODO: Defaults to auto timezone detection
  const userTimeZone = context.currentUser?.timezone || 'UTC';

  // Aggregate durations by date using user's timezone
  const aggregatedData: { [date: string]: number } = {};
  activities.forEach(activity => {
    // Format the date according to the user's timezone
    const dateStr = formatInTimeZone(activity.date, userTimeZone, 'yyyy/MM/dd');
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

export const createActivity: MutationResolvers['createActivity'] = async ({
  input,
}) => {
  // Call the consolidated validation function, passing currentUser
  const { media } = await validateActivityInput(input, context.currentUser);

  // Determine the final Date object for Prisma
  let finalDateForDb: Date;
  if (typeof input.date === 'string') {
    // Parse the validated string again
    finalDateForDb = parse(input.date, 'yyyy-MM-dd', new Date());
  } else if (input.date instanceof Date) {
    // Use the validated Date object directly
    finalDateForDb = input.date;
  } else {
    // Should be caught by validation, but defensive
    throw new Error(
      'Unexpected type for date field during database preparation.'
    );
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
