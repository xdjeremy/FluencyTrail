// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

import { medias } from './medias';
import { StandardScenario } from './medias.scenarios';

describe('medias', () => {
  scenario('mock test', async () => {
    expect(true).toEqual(true);
  });
  scenario('return media', async (scenario: StandardScenario) => {
    const result = await medias({
      query: 'john-wick-1234',
    });

    expect(result).toBe(scenario.media.one);

    expect(true).toEqual(true);
  });
});
