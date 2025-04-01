import { medias, searchMedias } from './medias';
import type { StandardScenario } from './medias.scenarios';

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('medias', () => {
  scenario('returns all medias', async (scenario: StandardScenario) => {
    const result = await medias();

    expect(result.length).toEqual(Object.keys(scenario.media).length);
  });

  scenario('searches medias', async () => {
    const result = await searchMedias({
      query: 'Batman',
    });

    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});
