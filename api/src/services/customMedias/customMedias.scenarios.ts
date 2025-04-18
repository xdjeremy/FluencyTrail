import type { Prisma, CustomMedia } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.CustomMediaCreateArgs>({
  customMedia: {
    one: {
      data: {
        title: 'String',
        slug: 'String4702162',
        updatedAt: '2025-04-18T01:14:17.101Z',
        User: {
          create: {
            email: 'String4556406',
            timezone: 'String',
            updatedAt: '2025-04-18T01:14:17.112Z',
          },
        },
      },
    },
    two: {
      data: {
        title: 'String',
        slug: 'String1369917',
        updatedAt: '2025-04-18T01:14:17.112Z',
        User: {
          create: {
            email: 'String8508076',
            timezone: 'String',
            updatedAt: '2025-04-18T01:14:17.125Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<CustomMedia, 'customMedia'>
