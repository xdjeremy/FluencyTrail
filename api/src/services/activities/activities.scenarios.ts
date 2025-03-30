import type { Prisma, Activity } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ActivityCreateArgs>({
  activity: {
    one: {
      data: {
        activityType: 'WATCHING',
        updatedAt: '2025-03-30T11:11:31.020Z',
        user: {
          create: {
            email: 'String2017493',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2025-03-30T11:11:31.024Z',
          },
        },
      },
    },
    two: {
      data: {
        activityType: 'WATCHING',
        updatedAt: '2025-03-30T11:11:31.024Z',
        user: {
          create: {
            email: 'String1483700',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2025-03-30T11:11:31.027Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Activity, 'activity'>
