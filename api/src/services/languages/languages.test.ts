import type { Language } from '@prisma/client';

import {
  languages,
  language,
  createLanguage,
  updateLanguage,
  deleteLanguage,
} from './languages';
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

  scenario('returns a single language', async (scenario: StandardScenario) => {
    const result = await language({ id: scenario.language.one.id });

    expect(result).toEqual(scenario.language.one);
  });

  scenario('creates a language', async () => {
    const result = await createLanguage({
      input: {
        code: 'String566748',
        name: 'String',
        updatedAt: '2025-04-11T14:00:02.974Z',
      },
    });

    expect(result.code).toEqual('String566748');
    expect(result.name).toEqual('String');
    expect(result.updatedAt).toEqual(new Date('2025-04-11T14:00:02.974Z'));
  });

  scenario('updates a language', async (scenario: StandardScenario) => {
    const original = (await language({
      id: scenario.language.one.id,
    })) as Language;
    const result = await updateLanguage({
      id: original.id,
      input: { code: 'String22138722' },
    });

    expect(result.code).toEqual('String22138722');
  });

  scenario('deletes a language', async (scenario: StandardScenario) => {
    const original = (await deleteLanguage({
      id: scenario.language.one.id,
    })) as Language;
    const result = await language({ id: original.id });

    expect(result).toEqual(null);
  });
});
