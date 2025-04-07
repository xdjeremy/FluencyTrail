import type { Prisma, Activity } from '@prisma/client';

import type { ScenarioData } from '@redwoodjs/testing/api';

export const standard = defineScenario<Prisma.ActivityCreateArgs>({
  activity: {
    one: {
      data: {
        activityType: 'WATCHING',
        date: '2025-03-30T11:11:30.989Z',
        duration: 15,
        notes: 'String',
        user: {
          create: {
            email: 'String2017493',
            name: 'String',
            hashedPassword: 'String',
            salt: 'String',
            timezone: 'UTC', // Add required timezone
            updatedAt: '2025-03-30T11:11:31.024Z',
          },
        },
      },
    },
    two: {
      data: {
        activityType: 'WATCHING',
        date: '2025-03-30T11:11:30.989Z',
        duration: 15,
        notes: 'String',
        user: {
          create: {
            email: 'String1483700',
            name: 'String',
            hashedPassword: 'String',
            salt: 'String',
            timezone: 'UTC', // Add required timezone
            updatedAt: '2025-03-30T11:11:31.027Z',
          },
        },
      },
    },
  },
});

export type StandardScenario = ScenarioData<Activity, 'activity'>;
