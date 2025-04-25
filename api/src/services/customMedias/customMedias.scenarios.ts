import type { Prisma, CustomMedia } from '@prisma/client';

import type { ScenarioData } from '@redwoodjs/testing/api';

export const standard = defineScenario<
  Prisma.CustomMediaCreateArgs | Prisma.LanguageCreateArgs
>({
  customMedia: {
    one: {
      data: {
        title: 'String',
        slug: 'String6361995',
        updatedAt: '2025-04-20T16:15:04.385Z',
        User: {
          create: {
            email: 'String2369822',
            timezone: 'String',
            updatedAt: '2025-04-20T16:15:04.397Z',
          },
        },
      },
    },
    two: {
      data: {
        title: 'String2',
        slug: 'String2769790',
        updatedAt: '2025-04-20T16:15:04.397Z',
        User: {
          create: {
            email: 'String1280293',
            timezone: 'String',
            updatedAt: '2025-04-20T16:15:04.408Z',
          },
        },
      },
    },
  },
  language: {
    one: {
      data: {
        id: 1,
        code: 'gb',
        name: 'English',
        nativeName: 'English',
      },
    },
  },
});

export type StandardScenario = ScenarioData<CustomMedia, 'customMedia'>;
