import type {
  QueryResolvers,
  MutationResolvers,
  CustomMediaRelationResolvers,
} from 'types/graphql';

import { db } from 'src/lib/db';

export const customMedias: QueryResolvers['customMedias'] = () => {
  if (!context.currentUser) {
    return [];
  }
  return db.customMedia.findMany({
    where: {
      userId: context.currentUser.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const customMedia: QueryResolvers['customMedia'] = ({ id }) => {
  return db.customMedia.findUnique({
    where: { id, userId: context.currentUser.id },
  });
};

export const createCustomMedia: MutationResolvers['createCustomMedia'] = ({
  input,
}) => {
  return db.customMedia.create({
    data: input,
  });
};

export const updateCustomMedia: MutationResolvers['updateCustomMedia'] = ({
  id,
  input,
}) => {
  return db.customMedia.update({
    data: input,
    where: { id },
  });
};

export const deleteCustomMedia: MutationResolvers['deleteCustomMedia'] = ({
  id,
}) => {
  return db.customMedia.delete({
    where: { id },
  });
};

export const CustomMedia: CustomMediaRelationResolvers = {
  User: (_obj, { root }) => {
    return db.customMedia.findUnique({ where: { id: root?.id } }).User();
  },
  Activity: (_obj, { root }) => {
    return db.customMedia.findUnique({ where: { id: root?.id } }).Activity();
  },
};
