import { toZonedTime } from 'date-fns-tz';
import type {
  ActivityTimerRelationResolvers,
  MutationResolvers,
  QueryResolvers,
} from 'types/graphql';

import { db } from 'src/lib/db';

export const activeTimer: QueryResolvers['activeTimer'] = async () => {
  return db.activityTimer.findFirst({
    where: {
      endTime: null,
      userId: context.currentUser.id,
    },
    orderBy: { startTime: 'desc' },
  });
};

export const startActivityTimer: MutationResolvers['startActivityTimer'] =
  async ({ input }) => {
    const { activityType, languageId } = input;

    const userTimeZone = context.currentUser?.timezone || 'UTC';

    // Get current time and convert to user's timezone
    const now = new Date();
    const nowInUserTz = toZonedTime(now, userTimeZone);

    return await db.activityTimer.create({
      data: {
        startTime: nowInUserTz,
        endTime: null,
        activityType,
        user: { connect: { id: context.currentUser.id } },
        language: { connect: { id: languageId } },
      },
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
