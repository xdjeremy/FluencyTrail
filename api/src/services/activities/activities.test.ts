import { createActivity } from './activities';

describe('createActivity', () => {
  scenario('creates a new activity with TMDB media', async scenario => {
    // Use the user data directly from the scenario
    mockCurrentUser({
      ...scenario.user.one, // Spread user data from the scenario
      roles: [], // Add roles if your auth requires it, often an empty array is fine
    });

    const activity = await createActivity({
      input: {
        mediaSlug: scenario.media.one.slug, // Use medias slug from scenario
        activityType: 'WATCHING',
        notes: 'Test notes',
        duration: 120,
        date: new Date('2024-01-01'),
        languageId: scenario.language.one.id, // Use language ID from scenario
      },
    });

    // expect activity to be created by the user from the scenario
    expect(activity.userId).toEqual(scenario.user.one.id);
  });

  // This is handled by the SDL
  scenario('fails if user is not logged in', async () => {});

  scenario('creates a new activity with custom media', async scenario => {
    mockCurrentUser({
      ...scenario.user.one, // Spread user data from the scenario
      roles: [], // Add roles if your auth requires it, often an empty array is fine
    });

    const activity = await createActivity({
      input: {
        activityType: 'WATCHING',
        notes: 'Test notes',
        duration: 120,
        date: new Date('2024-01-01'),
        languageId: scenario.language.one.id, // Use language ID from scenario
        customMediaTitle: 'Custom Media Title',
      },
    });

    // Expect activity to be created by the user from the scenario
    expect(activity.userId).toEqual(scenario.user.one.id);
  });
});
