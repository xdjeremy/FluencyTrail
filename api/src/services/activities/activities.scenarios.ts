import type { Activity, Prisma } from '@prisma/client';

import type { ScenarioData } from '@redwoodjs/testing/api';

export const standard = defineScenario<
  Prisma.ActivityCreateArgs,
  'activity',
  'one'
>({
  activity: {
    one: {
      data: {
        user: {
          create: {
            id: 1,
            name: 'John Doe',
            timezone: 'UTC',
            email: 'john@example.com',
            languages: {
              connectOrCreate: {
                where: { id: 1 },
                create: {
                  name: 'English',
                  code: 'en',
                  id: 1,
                },
              },
            },
          },
        },
        id: '1',
        date: new Date('2023-10-01T00:00:00Z'), // UTC date
        duration: 60,
        activityType: 'GRAMMAR',
        media: {
          create: {
            mediaType: 'BOOK',
            externalId: '12345',
            title: 'Sample Book',
            id: '1',
            slug: 'sample-book',
            description: 'A sample book for testing',
          },
        },
        language: {
          create: {
            id: 1,
            code: 'en',
            name: 'English',
          },
        },
        createdAt: new Date('2023-10-01T00:00:00Z'), // UTC date
        updatedAt: new Date('2023-10-01T00:00:00Z'), // UTC date
      },
    },
  },
});

export type StandardScenario = ScenarioData<Activity, 'activity', 'one'>;
