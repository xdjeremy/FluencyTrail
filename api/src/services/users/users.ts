import type {
  MutationResolvers,
  UserRelationResolvers,
  User as UserType,
} from 'types/graphql';

import { validateWith } from '@redwoodjs/api';

import { db } from 'src/lib/db';

// export const users: QueryResolvers['users'] = () => {
//   return db.user.findMany();
// };

// export const user: QueryResolvers['user'] = ({ id }) => {
//   return db.user.findUnique({
//     where: { id },
//   });
// };

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
