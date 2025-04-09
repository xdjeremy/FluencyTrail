import type {
  MutationResolvers,
  QueryResolvers,
  UserRelationResolvers,
  User as UserType,
} from 'types/graphql';

import { validate, validateWith, validateWithSync } from '@redwoodjs/api';
import { hashPassword } from '@redwoodjs/auth-dbauth-api';

import { db } from 'src/lib/db';

// export const users: QueryResolvers['users'] = () => {
//   return db.user.findMany();
// };

export const user: QueryResolvers['user'] = ({ id }) => {
  // if there is no id provided, use the current user id
  const userId = id ? id : context.currentUser.id;

  // if there's really no id, throw an error
  if (!userId) {
    throw new Error('No user id provided');
  }

  return db.user.findUnique({
    where: { id: userId },
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

export const editUser: MutationResolvers['editUser'] = async ({ input }) => {
  const userId = context.currentUser.id;
  const validTimezones = new Set(Intl.supportedValuesOf('timeZone'));

  validate(input.name, {
    // Use the destructured 'name' variable
    presence: {
      message: 'Name is required',
    },
    length: {
      min: 2,
      max: 100,
      message: 'Name must be between 2 and 100 characters',
    },
  });
  validate(input.timezone, {
    // Validate timezone presence
    presence: { message: 'Timezone is required' },
  });

  // Validate timezone value against known IANA identifiers
  if (!validTimezones.has(input.timezone)) {
    throw new Error(
      'Invalid timezone. Please provide a valid IANA timezone identifier. For example, "America/New_York" or "Europe/London"'
    );
  }

  return db.user.update({
    where: {
      id: userId,
    },
    data: {
      name: input.name,
      timezone: input.timezone,
    },
  });
};

export const updateUserPassword: MutationResolvers['updateUserPassword'] =
  async ({ input: { currentPassword, newPassword } }) => {
    const userId = context.currentUser.id;

    // Get current user's password data
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { hashedPassword: true, salt: true },
    });

    validateWithSync(() => {
      if (!user) {
        throw new Error('User not found');
      }
    });

    // Verify current password
    validateWithSync(() => {
      const [currentHash] = hashPassword(currentPassword, { salt: user.salt });
      if (currentHash !== user.hashedPassword) {
        throw new Error('Current password is incorrect');
      }
    });

    // Validate new password
    validate(newPassword, {
      presence: { message: 'New password is required' },
      length: {
        min: 8,
        message: 'Password must be at least 8 characters long',
      },
      format: {
        pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/,
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      },
    });

    const [hashedPassword, salt] = hashPassword(newPassword);

    return db.user.update({
      where: { id: userId },
      data: { hashedPassword, salt },
    });
  };

export const deleteUser: MutationResolvers['deleteUser'] = async () => {
  const userId = context.currentUser.id;

  // delete user
  return db.user.delete({
    where: {
      id: userId,
    },
  });
};

export const User: UserRelationResolvers = {
  Activity: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).Activity();
  },
};
