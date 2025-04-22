import { createCustomMedia, customMedias } from './customMedias';
import type { StandardScenario } from './customMedias.scenarios';

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('list customMedias', () => {
  scenario('returns all customMedias', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.customMedia.one.userId,
      email: 'String2369822',
      name: 'String2369822',
      timezone: 'UTC',
    });

    const result = await customMedias();

    expect(result.length).toEqual(1);
  });

  scenario('unauthorized user cannot list customMedias', async () => {
    const result = await customMedias();

    expect(result.length).toEqual(0);
  });
});

describe('create customMedia', () => {
  scenario('create a customMedia', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.customMedia.one.userId,
      email: 'String2369822',
      name: 'String2369822',
      timezone: 'UTC',
    });

    await createCustomMedia({
      input: {
        title: 'New Custom Media',
      },
    });

    const result = await customMedias();
    expect(result.length).toEqual(2);
  });

  scenario('throws errors when customMedia with invalid data', async () => {
    const fcn = async () =>
      await createCustomMedia({
        input: {
          title: '',
        },
      });
    await expect(fcn).rejects.toThrow();
  });

  scenario(
    'throws error when customMedia with existing title from same user',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.customMedia.one.userId,
        email: 'String236',
        name: 'String2369822',
        timezone: 'UTC',
      });

      const fcn = async () =>
        await createCustomMedia({
          input: { ...scenario.customMedia.one },
        });

      await expect(fcn).rejects.toThrow();
    }
  );

  scenario(
    'create customMedia with existing title from different user',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.customMedia.two.userId,
        email: 'String2369822',
        name: 'String2369822',
        timezone: 'UTC',
      });

      await createCustomMedia({
        input: {
          title: scenario.customMedia.one.title,
        },
      });

      const result = await customMedias();
      expect(result.length).toEqual(2);
    }
  );
});
