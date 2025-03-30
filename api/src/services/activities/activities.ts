import type {
  QueryResolvers,
  MutationResolvers,
  ActivityRelationResolvers,
} from 'types/graphql';

import { db } from 'src/lib/db';

export const activities: QueryResolvers['activities'] = () => {
  return db.activity.findMany();
};

export const activity: QueryResolvers['activity'] = ({ id }) => {
  return db.activity.findUnique({
    where: { id },
  });
};

export const createActivity: MutationResolvers['createActivity'] = ({
  input,
}) => {
  return db.activity.create({
    data: {
      ...input,
      userId: context.currentUser.id,
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
