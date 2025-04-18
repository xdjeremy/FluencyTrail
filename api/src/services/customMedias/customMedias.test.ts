import type { CustomMedia } from '@prisma/client'

import {
  customMedias,
  customMedia,
  createCustomMedia,
  updateCustomMedia,
  deleteCustomMedia,
} from './customMedias'
import type { StandardScenario } from './customMedias.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('customMedias', () => {
  scenario('returns all customMedias', async (scenario: StandardScenario) => {
    const result = await customMedias()

    expect(result.length).toEqual(Object.keys(scenario.customMedia).length)
  })

  scenario(
    'returns a single customMedia',
    async (scenario: StandardScenario) => {
      const result = await customMedia({ id: scenario.customMedia.one.id })

      expect(result).toEqual(scenario.customMedia.one)
    }
  )

  scenario('creates a customMedia', async (scenario: StandardScenario) => {
    const result = await createCustomMedia({
      input: {
        title: 'String',
        slug: 'String8424422',
        updatedAt: '2025-04-18T01:14:17.008Z',
        userId: scenario.customMedia.two.userId,
      },
    })

    expect(result.title).toEqual('String')
    expect(result.slug).toEqual('String8424422')
    expect(result.updatedAt).toEqual(new Date('2025-04-18T01:14:17.008Z'))
    expect(result.userId).toEqual(scenario.customMedia.two.userId)
  })

  scenario('updates a customMedia', async (scenario: StandardScenario) => {
    const original = (await customMedia({
      id: scenario.customMedia.one.id,
    })) as CustomMedia
    const result = await updateCustomMedia({
      id: original.id,
      input: { title: 'String2' },
    })

    expect(result.title).toEqual('String2')
  })

  scenario('deletes a customMedia', async (scenario: StandardScenario) => {
    const original = (await deleteCustomMedia({
      id: scenario.customMedia.one.id,
    })) as CustomMedia
    const result = await customMedia({ id: original.id })

    expect(result).toEqual(null)
  })
})
