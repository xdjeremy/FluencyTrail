import type { Prisma, Media } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MediaCreateArgs>({
  media: {
    one: {
      data: {
        externalId: 'String2327280',
        title: 'String',
        mediaType: 'MOVIE',
        updatedAt: '2025-03-31T19:12:33.873Z',
      },
    },
    two: {
      data: {
        externalId: 'String4636330',
        title: 'String',
        mediaType: 'MOVIE',
        updatedAt: '2025-03-31T19:12:33.873Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Media, 'media'>
