import type {
  CustomMediaRelationResolvers,
  MutationResolvers,
  QueryResolvers,
} from 'types/graphql';

import { validate } from '@redwoodjs/api';

import { db } from 'src/lib/db';
import { slugify } from 'src/lib/utils/slugify';

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
  // validate input
  validate(input.title, 'Title', {
    presence: {
      message: 'Title is required',
    },
    length: {
      max: 100,
    },
  });

  // generate slug
  const slug = `${slugify(input.title)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;

  return db.customMedia.create({
    data: {
      title: input.title,
      slug: slug,
      userId: context.currentUser.id,
    },
  });
};

export const updateCustomMedia: MutationResolvers['updateCustomMedia'] = ({
  id,
  input,
}) => {
  // validate input
  validate(input.title, 'Title', {
    presence: {
      message: 'Title is required',
    },
    length: {
      max: 100,
      min: 1,
    },
  });

  // generate slug
  const slug = `${slugify(input.title)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;

  return db.customMedia.update({
    data: {
      title: input.title,
      slug: slug,
    },
    where: { id, userId: context.currentUser.id },
  });
};

export const deleteCustomMedia: MutationResolvers['deleteCustomMedia'] = ({
  id,
}) => {
  validate(id, 'ID', {
    presence: {
      message: 'ID is required',
    },
    length: {
      min: 1,
      message: 'ID is required',
    },
  });

  return db.customMedia.delete({
    where: { id, userId: context.currentUser.id },
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
