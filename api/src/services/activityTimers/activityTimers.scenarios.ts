import type {
  ActivityTimer,
  CustomMedia,
  Language, // Import Language type
  Media,
  Prisma,
  User,
} from '@prisma/client';

import type { ScenarioData } from '@redwoodjs/testing/api';

export const standard = defineScenario<
  | Prisma.UserCreateArgs
  | Prisma.ActivityTimerCreateArgs
  | Prisma.LanguageCreateArgs
  | Prisma.MediaCreateArgs
  | Prisma.CustomMediaCreateArgs
>({
  language: {
    // Define languages first so they can be connected
    english: {
      data: {
        code: 'gb',
        name: 'English',
        nativeName: 'English',
        updatedAt: '2025-04-26T08:49:44.449Z',
      },
    },
    spanish: {
      data: {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        updatedAt: '2025-04-26T08:49:44.449Z',
      },
    },
    timerLang1: {
      data: {
        code: 'timerLang1', // Unique code
        name: 'Timer Lang 1',
        nativeName: 'Timer Lang 1',
        updatedAt: '2025-04-26T08:49:44.492Z',
      },
    },
    timerLang2: {
      data: {
        code: 'timerLang2', // Unique code
        name: 'Timer Lang 2',
        nativeName: 'Timer Lang 2',
        updatedAt: '2025-04-26T08:49:44.523Z',
      },
    },
  },
  user: {
    // Define users next
    noTimer: {
      data: {
        email: 'noTimer@example.com', // Unique email
        timezone: 'Asia/Manila',
        updatedAt: '2025-04-26T08:49:44.449Z',
        name: 'Test User',
        primaryLanguage: { connect: { code: 'gb' } }, // Connect to defined language
        languages: { connect: { code: 'gb' } }, // Connect to defined language
      },
    },
    invalidLang: {
      data: {
        email: 'invalidLang@example.com', // Unique email
        timezone: 'UTC',
        updatedAt: '2025-04-26T08:49:44.449Z',
        name: 'Invalid Lang User',
        primaryLanguage: { connect: { code: 'es' } }, // Connect to defined language
        // No languages connected to test the invalid language case
      },
    },
    timerUser1: {
      // User for the 'noEnd' timer
      data: {
        email: 'timerUser1@example.com', // Unique email
        timezone: 'Asia/Manila',
        updatedAt: '2025-04-26T08:49:44.474Z',
        primaryLanguage: { connect: { code: 'timerLang1' } },
        languages: { connect: { code: 'timerLang1' } },
      },
    },
    timerUser2: {
      // User for the 'withEnd' timer
      data: {
        email: 'timerUser2@example.com', // Unique email
        timezone: 'Asia/Manila',
        updatedAt: '2025-04-26T08:49:44.508Z',
        primaryLanguage: { connect: { code: 'timerLang2' } },
        languages: { connect: { code: 'timerLang2' } },
      },
    },
  },
  activityTimer: {
    noEnd: {
      data: {
        startTime: '2025-04-26T08:49:44.449Z',
        endTime: null,
        activityType: 'WATCHING',
        user: { connect: { email: 'timerUser1@example.com' } }, // Connect to defined user
        language: { connect: { code: 'timerLang1' } }, // Connect to defined language
      },
    },
    withEnd: {
      data: {
        startTime: '2025-04-26T08:49:44.492Z',
        endTime: '2025-04-26T08:49:44.492Z',
        activityType: 'WATCHING',
        user: { connect: { email: 'timerUser2@example.com' } }, // Connect to defined user
        language: { connect: { code: 'timerLang2' } }, // Connect to defined language
      },
    },
  },
  media: {
    movie: {
      data: {
        title: 'Test Movie',
        slug: 'test-movie',
        mediaType: 'MOVIE',
        externalId: 'tt123456',
        ttl: 2592000,
        createdAt: '2025-04-26T08:49:44.449Z',
        updatedAt: '2025-04-26T08:49:44.449Z',
      },
    },
    invalid: {
      data: {
        title: 'Invalid Type',
        slug: 'invalid-type',
        mediaType: 'BOOK',
        externalId: 'book123',
        ttl: 2592000,
        createdAt: '2025-04-26T08:49:44.449Z',
        updatedAt: '2025-04-26T08:49:44.449Z',
      },
    },
  },
  customMedia: {
    existing: {
      data: {
        title: 'Custom Media Test',
        slug: 'custom-media-test',
        User: { connect: { email: 'noTimer@example.com' } }, // Correct casing: User
        createdAt: '2025-04-26T08:49:44.449Z',
        updatedAt: '2025-04-26T08:49:44.449Z',
      },
    },
  },
});

export type StandardScenario = ScenarioData<
  User | ActivityTimer | Media | CustomMedia | Language, // Add Language
  'user' | 'activityTimer' | 'media' | 'customMedia' | 'language' // Add language
>;
