import type { Prisma, Language } from '@prisma/client';

import type { ScenarioData } from '@redwoodjs/testing/api';

export const standard = defineScenario<Prisma.LanguageCreateArgs>({
  language: {
    one: {
      data: {
        code: 'String5379744',
        name: 'String',
        updatedAt: '2025-04-11T14:00:03.051Z',
      },
    },
    two: {
      data: {
        code: 'String8335438',
        name: 'String',
        updatedAt: '2025-04-11T14:00:03.051Z',
      },
    },
  },
});

export type StandardScenario = ScenarioData<Language, 'language'>;
