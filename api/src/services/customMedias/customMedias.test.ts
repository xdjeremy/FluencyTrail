import { customMedias } from './customMedias';
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
