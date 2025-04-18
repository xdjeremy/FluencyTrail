import type {
  QueryResolvers,
  MutationResolvers,
  CustomMediaRelationResolvers,
} from 'types/graphql';

import { db } from 'src/lib/db';

export const customMedias: QueryResolvers['customMedias'] = () => {
  return db.customMedia.findMany();
};

export const customMedia: QueryResolvers['customMedia'] = ({ id }) => {
  return db.customMedia.findUnique({
    where: { id },
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
