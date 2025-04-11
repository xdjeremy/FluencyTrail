import type { Prisma } from '@prisma/client';
import type {
  MutationResolvers,
  QueryResolvers,
  UserRelationResolvers,
  User as UserType,
} from 'types/graphql';

import {
  RedwoodError,
  validate,
  validateWith,
  validateWithSync,
} from '@redwoodjs/api';
import { hashPassword } from '@redwoodjs/auth-dbauth-api';

import { db } from 'src/lib/db';

// export const users: QueryResolvers['users'] = () => {
//   return db.user.findMany();
// };

export const user: QueryResolvers['user'] = ({ id }) => {
  // if there is no id provided, use the current user id if available
  const userId = id || context.currentUser?.id;

  // if there's really no id, throw an error
  validateWithSync(() => {
    if (!userId) {
      throw new Error('No user id provided');
    }
  });

  return db.user.findUnique({
    where: { id: userId },
    include: {
      languages: true,
      primaryLanguage: true,
    },
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
  validateWithSync(() => {
    if (!validTimezones.has(input.timezone)) {
      throw new Error(
        'Invalid timezone. Please provide a valid IANA timezone identifier. For example, "America/New_York" or "Europe/London"'
      );
    }
  });

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

export const userStats: QueryResolvers['userStats'] = async ({
  userId,
  languageId,
}) => {
  // Ensure current user can only access their own stats
  if (userId !== context.currentUser?.id) {
    throw new RedwoodError('Unauthorized');
  }

  const where: Prisma.ActivityWhereInput = { userId };
  if (languageId) {
    where.languageId = languageId;
  }

  const activities = await db.activity.findMany({
    where,
    select: {
      date: true,
      duration: true,
    },
    orderBy: { date: 'asc' },
  });

  // Calculate stats
  const totalMinutes = activities.reduce(
    (sum, act) => sum + (act.duration || 0),
    0
  );

  // Get unique dates for streak calculation
  const uniqueDates = new Set(
    activities.map(a => a.date.toISOString().split('T')[0])
  );
  const sortedDates = Array.from(uniqueDates).sort();

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let currentCount = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      currentCount = 1;
    } else {
      const curr = new Date(sortedDates[i]);
      const prev = new Date(sortedDates[i - 1]);
      const diffDays = Math.floor(
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        currentCount++;
      } else {
        // Streak broken
        longestStreak = Math.max(longestStreak, currentCount);
        currentCount = 1;
      }
    }
  }

  // Update longest streak one final time
  longestStreak = Math.max(longestStreak, currentCount);

  // Check if the last date is today or yesterday for current streak
  if (sortedDates.length > 0) {
    const lastDate = new Date(sortedDates[sortedDates.length - 1]);
    const today = new Date();
    const diffDays = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    currentStreak = diffDays <= 1 ? currentCount : 0;
  } else {
    currentStreak = 0;
  }

  return {
    totalMinutes,
    currentStreak,
    longestStreak,
  };
};

export const addUserLanguage: MutationResolvers['addUserLanguage'] = async ({
  input,
}) => {
  const userId = context.currentUser.id;

  // Find the language by code
  const language = await db.language.findUnique({
    where: { code: input.languageCode },
  });

  if (!language) {
    throw new RedwoodError('Language not found');
  }

  // Check if user already has this language
  const existingLanguage = await db.user.findFirst({
    where: {
      id: userId,
      languages: { some: { code: input.languageCode } },
    },
  });

  if (existingLanguage) {
    throw new RedwoodError('Language already added to your profile');
  }

  // Add the language to user's list
  return db.user.update({
    where: { id: userId },
    data: {
      languages: {
        connect: { id: language.id },
      },
    },
    include: {
      languages: true,
      primaryLanguage: true,
    },
  });
};

export const removeUserLanguage: MutationResolvers['removeUserLanguage'] =
  async ({ input }) => {
    const userId = context.currentUser.id;

    const language = await db.language.findUnique({
      where: { code: input.languageCode },
    });

    if (!language) {
      throw new RedwoodError('Language not found');
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        languages: true,
      },
    });

    if (!user) {
      throw new RedwoodError('User not found');
    }

    // Cannot remove the primary language
    if (user.primaryLanguageId === language.id) {
      throw new RedwoodError(
        'Cannot remove primary language. Set a different primary language first.'
      );
    }

    // Cannot remove if it's the only language
    if (user.languages.length <= 1) {
      throw new RedwoodError('Cannot remove your only language');
    }

    return db.user.update({
      where: { id: userId },
      data: {
        languages: {
          disconnect: { id: language.id },
        },
      },
      include: {
        languages: true,
        primaryLanguage: true,
      },
    });
  };

export const setPrimaryLanguage: MutationResolvers['setPrimaryLanguage'] =
  async ({ input }) => {
    const userId = context.currentUser.id;

    const language = await db.language.findUnique({
      where: { code: input.languageCode },
    });

    if (!language) {
      throw new RedwoodError('Language not found');
    }

    // Verify user has this language
    const user = await db.user.findFirst({
      where: {
        id: userId,
        languages: { some: { id: language.id } },
      },
    });

    if (!user) {
      throw new RedwoodError(
        'You must add this language before setting it as primary'
      );
    }

    return db.user.update({
      where: { id: userId },
      data: {
        primaryLanguageId: language.id,
      },
      include: {
        languages: true,
        primaryLanguage: true,
      },
    });
  };

export const User: UserRelationResolvers = {
  Activity: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).Activity();
  },
  languages: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).languages();
  },
  primaryLanguage: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).primaryLanguage();
  },
};
