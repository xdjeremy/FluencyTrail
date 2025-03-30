import type { Activity } from '@prisma/client'

import {
  activities,
  activity,
  createActivity,
  updateActivity,
  deleteActivity,
} from './activities'
import type { StandardScenario } from './activities.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('activities', () => {
  scenario('returns all activities', async (scenario: StandardScenario) => {
    const result = await activities()

    expect(result.length).toEqual(Object.keys(scenario.activity).length)
  })

  scenario('returns a single activity', async (scenario: StandardScenario) => {
    const result = await activity({ id: scenario.activity.one.id })

    expect(result).toEqual(scenario.activity.one)
  })

  scenario('creates a activity', async (scenario: StandardScenario) => {
    const result = await createActivity({
      input: {
        userId: scenario.activity.two.userId,
        activityType: 'WATCHING',
        updatedAt: '2025-03-30T11:11:30.989Z',
      },
    })

    expect(result.userId).toEqual(scenario.activity.two.userId)
    expect(result.activityType).toEqual('WATCHING')
    expect(result.updatedAt).toEqual(new Date('2025-03-30T11:11:30.989Z'))
  })

  scenario('updates a activity', async (scenario: StandardScenario) => {
    const original = (await activity({
      id: scenario.activity.one.id,
    })) as Activity
    const result = await updateActivity({
      id: original.id,
      input: { activityType: 'OTHER' },
    })

    expect(result.activityType).toEqual('OTHER')
  })

  scenario('deletes a activity', async (scenario: StandardScenario) => {
    const original = (await deleteActivity({
      id: scenario.activity.one.id,
    })) as Activity
    const result = await activity({ id: original.id })

    expect(result).toEqual(null)
  })
})
