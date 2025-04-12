import { languages } from './languages';
import type { StandardScenario } from './languages.scenarios';

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('languages', () => {
  scenario('returns all languages', async (scenario: StandardScenario) => {
    const result = await languages();

    expect(result.length).toEqual(Object.keys(scenario.language).length);
  });
});
