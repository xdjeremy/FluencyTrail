import type {
  MutationResolvers,
  QueryResolvers,
  UserRelationResolvers,
  User as UserType,
} from 'types/graphql';

import { validateWith } from '@redwoodjs/api';

import { db } from 'src/lib/db';

// export const users: QueryResolvers['users'] = () => {
//   return db.user.findMany();
// };

export const user: QueryResolvers['user'] = ({ id }) => {
  // if there is no id provided, use the current user id
  const userId = id || context.currentUser?.id;

  // if there's really no id, throw an error
  if (!userId) {
    throw new Error('No user id provided');
  }

  return db.user.findUnique({
    where: { id },
  });
};

export const confirmUserEmail: MutationResolvers['confirmUserEmail'] = async ({
  token,
}) => {
  let user: Pick<UserType, 'id'>;
  // Find the user by the token and check if the token is valid
  // if not valid, it will throw an error
  await validateWith(async () => {
    user = await db.user.findFirstOrThrow({
      where: {
        emailVerificationToken: token,
        emailVerificationTokenExpiresAt: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
      },
    });
  });

  return db.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpiresAt: null,
    },
  });
};

export const User: UserRelationResolvers = {
  Activity: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).Activity();
  },
};
