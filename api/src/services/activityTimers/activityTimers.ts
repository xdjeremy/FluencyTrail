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
  () => {};

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
