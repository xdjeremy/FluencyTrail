import { parse, subYears } from 'date-fns'; // Keep only parse
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

  // Aggregate durations by date
  const aggregatedData: { [date: string]: number } = {};
  activities.forEach(activity => {
    const dateStr = activity.date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
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

export const createActivity: MutationResolvers['createActivity'] = async ({
  input,
}) => {
  // Call the consolidated validation function
  const { media } = await validateActivityInput(input);

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
