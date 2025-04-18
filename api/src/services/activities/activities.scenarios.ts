import type { Prisma } from '@prisma/client';

export const standard = defineScenario<Prisma.ActivityCreateArgs>({
  activity: {
    withTMDBMedia: {
      data: {
        activityType: 'WATCHING',
        date: '2025-04-18T00:00:00Z',
        duration: 30,
        user: {
          create: {
            id: 1,
            email: 'test@example.com',
            timezone: 'UTC',
            hashedPassword: 'dummy',
            salt: 'dummy',
            languages: {
              create: {
                id: 1,
                code: 'en',
                name: 'English',
              },
            },
          },
        },
        language: {
          connect: { id: 1 },
        },
        media: {
          create: {
            title: 'Test Movie',
            slug: 'test-movie',
            externalId: 'tmdb-123',
            mediaType: 'MOVIE',
          },
        },
      },
    },
    withCustomMedia: {
      data: {
        activityType: 'WATCHING',
        date: '2025-04-18T00:00:00Z',
        duration: 45,
        user: {
          create: {
            id: 2,
            email: 'user2@example.com',
            timezone: 'UTC',
            hashedPassword: 'dummy',
            salt: 'dummy',
            languages: {
              create: {
                id: 2,
                code: 'ja',
                name: 'Japanese',
              },
            },
          },
        },
        language: {
          connect: { id: 2 },
        },
        customMedia: {
          create: {
            title: 'My Custom Show',
            slug: 'my-custom-show',
            userId: 2,
          },
        },
      },
    },
    noMedia: {
      data: {
        activityType: 'GRAMMAR',
        date: '2025-04-18T00:00:00Z',
        duration: 15,
        user: {
          create: {
            id: 3,
            email: 'user3@example.com',
            timezone: 'UTC',
            hashedPassword: 'dummy',
            salt: 'dummy',
            languages: {
              create: {
                id: 3,
                code: 'es',
                name: 'Spanish',
              },
            },
          },
        },
        language: {
          connect: { id: 3 },
        },
      },
    },
  },
});

export type StandardScenario = typeof standard;
