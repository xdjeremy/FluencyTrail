import type { Prisma, User } from '@prisma/client';

import type { ScenarioData } from '@redwoodjs/testing/api';

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        email: 'String1828080',
        hashedPassword: 'String',
        salt: 'String',
        timezone: 'America/Los_Angeles',
        updatedAt: '2025-03-30T11:13:26.011Z',
      },
    },
    two: {
      data: {
        email: 'String9662096',
        hashedPassword: 'String',
        salt: 'String',
        timezone: 'America/Los_Angeles',
        updatedAt: '2025-03-30T11:13:26.011Z',
      },
    },
  },
});

export type StandardScenario = ScenarioData<User, 'user'>;
