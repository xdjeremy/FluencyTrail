import { media } from './medias';
import type { StandardScenario } from './medias.scenarios';

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('medias', () => {
  scenario('return first media', async (scenario: StandardScenario) => {
    const result = await media();

    expect(result).toEqual(scenario.media.one);
  });
});
