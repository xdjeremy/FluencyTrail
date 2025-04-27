import type { ActivityTimer, Prisma, User } from '@prisma/client';

import type { ScenarioData } from '@redwoodjs/testing/api';

export const standard = defineScenario<
  | Prisma.UserCreateArgs
  | Prisma.ActivityTimerCreateArgs
  | Prisma.LanguageCreateArgs
>({
  user: {
    noTimer: {
      data: {
        email: 'email@example.com',
        timezone: 'Asia/Manila',
        updatedAt: '2025-04-26T08:49:44.449Z',
        primaryLanguage: {
          connectOrCreate: {
            where: {
              code: 'gb',
            },
            create: {
              code: 'gb',
              name: 'English',
              nativeName: 'English',
            },
          },
        },
        languages: {
          connectOrCreate: {
            where: {
              code: 'gb',
            },
            create: {
              code: 'gb',
              name: 'English',
              nativeName: 'English',
            },
          },
        },
      },
    },
  },
  activityTimer: {
    noEnd: {
      data: {
        startTime: '2025-04-26T08:49:44.449Z',
        endTime: null,
        activityType: 'WATCHING',
        user: {
          create: {
            email: 'String6072784',
            timezone: 'Asia/Manila',
            updatedAt: '2025-04-26T08:49:44.474Z',
          },
        },
        language: {
          create: {
            code: 'String6503223',
            name: 'String',
            nativeName: 'String',
            updatedAt: '2025-04-26T08:49:44.492Z',
          },
        },
      },
    },
    withEnd: {
      data: {
        startTime: '2025-04-26T08:49:44.492Z',
        endTime: '2025-04-26T08:49:44.492Z',
        activityType: 'WATCHING',
        user: {
          create: {
            email: 'String3489995',
            timezone: 'Asia/Manila',
            updatedAt: '2025-04-26T08:49:44.508Z',
          },
        },
        language: {
          create: {
            code: 'String1226384',
            name: 'String',
            nativeName: 'String',
            updatedAt: '2025-04-26T08:49:44.523Z',
          },
        },
      },
    },
  },
});

export type StandardScenario = ScenarioData<
  User | ActivityTimer,
  'user' | 'activityTimer'
>;
