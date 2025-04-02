import type { Prisma, Media } from '@prisma/client';

import type { ScenarioData } from '@redwoodjs/testing/api';

export const standard = defineScenario<Prisma.MediaCreateArgs>({
  media: {
    one: {
      data: {
        slug: 'john-wick-1234',
        externalId: '1234',
        title: 'String',
        mediaType: 'MOVIE',
        updatedAt: '2025-03-31T19:12:33.873Z',
      },
    },
    two: {
      data: {
        slug: 'dr-strange-12322',
        externalId: '12322',
        title: 'String',
        mediaType: 'MOVIE',
        updatedAt: '2025-03-31T19:12:33.873Z',
      },
    },
  },
});

export type StandardScenario = ScenarioData<Media, 'media'>;
