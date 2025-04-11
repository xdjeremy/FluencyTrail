import type { Activity, Language, User } from '@prisma/client';

import type { ScenarioData } from '@redwoodjs/testing/api';

// Define the expected structure of the scenario data after creation
// Let Redwood infer the exact types where possible, focus on model structure
export type StandardScenario = ScenarioData<{
  language: Language[];
  user: User[];
  activity: Activity[];
}>;

export const standard = defineScenario({
  language: {
    // Use descriptive keys matching the model name (lowercase)
    language_en: {
      data: {
        code: 'en',
        name: 'English',
        updatedAt: new Date(),
      },
    },
    language_es: {
      data: {
        code: 'es',
        name: 'Spanish',
        updatedAt: new Date(),
      },
    },
  },
  user: {
    user_one: {
      // Use descriptive key
      data: {
        email: 'userone@example.com',
        name: 'User One',
        hashedPassword: 'mockhashedpassword',
        salt: 'mocksalt',
        timezone: 'UTC',
        updatedAt: new Date(),
        languages: { connect: { code: 'en' } },
        primaryLanguage: { connect: { code: 'en' } },
      },
    },
  },
  activity: {
    activity_one: scenario => ({
      // Use descriptive key
      data: {
        activityType: 'WATCHING',
        date: '2025-03-30T11:11:30.989Z',
        duration: 15,
        notes: 'Activity One Notes',
        user: {
          connect: { id: scenario.user.user_one.id }, // Use correct key
        },
        language: {
          connect: { id: scenario.language.language_en.id }, // Use correct key
        },
      },
    }),
    activity_two: scenario => ({
      // Use descriptive key
      data: {
        activityType: 'READING',
        date: '2025-03-31T11:11:30.989Z',
        duration: 30,
        notes: 'Activity Two Notes',
        user: {
          connect: { id: scenario.user.user_one.id }, // Use correct key
        },
        language: {
          connect: { id: scenario.language.language_es.id }, // Use correct key
        },
      },
    }),
  },
});
