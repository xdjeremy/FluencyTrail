import type {
  ActivityTimer,
  ActivityType,
  CustomMedia,
  Media,
  User,
} from '@prisma/client';

import { activeTimer, startActivityTimer } from './activityTimers';
import type { StandardScenario } from './activityTimers.scenarios';

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('active timer', () => {
  scenario('get active timer', async (scenario: StandardScenario) => {
    const noEndTimer = scenario.activityTimer.noEnd as ActivityTimer;

    mockCurrentUser({
      id: noEndTimer.userId,
      email: 'String6072784',
      timezone: 'UTC',
      name: 'String',
    });

    const result = await activeTimer();

    expect(result.id).toEqual(scenario.activityTimer.noEnd.id);
  });

  scenario(
    'return null if no active timer',
    async (scenario: StandardScenario) => {
      const withEndTimer = scenario.activityTimer.withEnd as ActivityTimer;

      mockCurrentUser({
        id: withEndTimer.userId,
        email: 'String6072784',
        timezone: 'UTC',
        name: 'String',
      });

      const result = await activeTimer();
      expect(result).toEqual(null);
    }
  );

  scenario(
    'return null if absolutely no history of activity timers',
    async (scenario: StandardScenario) => {
      const noTimer = scenario.user.noTimer as User;

      mockCurrentUser({
        id: noTimer.id,
        email: noTimer.email,
        timezone: noTimer.timezone,
        name: noTimer.name,
      });

      const result = await activeTimer();
      expect(result).toEqual(null);
    }
  );
});

describe('Start ActivityTimer', () => {
  scenario('start an activityTimer', async (scenario: StandardScenario) => {
    const noTimer = scenario.user.noTimer as User;

    mockCurrentUser({
      id: noTimer.id,
      email: noTimer.email,
      timezone: noTimer.timezone,
      name: noTimer.name,
    });

    const timer = await startActivityTimer({
      input: {
        activityType: 'WATCHING',
        languageId: noTimer.primaryLanguageId,
      },
    });

    expect(timer.activityType).toEqual('WATCHING');
    expect(timer.languageId).toEqual(noTimer.primaryLanguageId);

    expect(timer.startTime).toBeDefined();
    expect(timer.endTime).toEqual(null);
  });

  scenario(
    'start an activityTimer with new custom media',
    async (scenario: StandardScenario) => {
      const noTimer = scenario.user.noTimer as User;

      mockCurrentUser({
        id: noTimer.id,
        email: noTimer.email,
        timezone: noTimer.timezone,
        name: noTimer.name,
      });

      const timer = await startActivityTimer({
        input: {
          activityType: 'WATCHING',
          languageId: noTimer.primaryLanguageId,
          customMediaTitle: 'My Custom Media',
        },
      });

      expect(timer.customMedia).toBeDefined();
      expect(timer.customMedia?.title).toEqual('My Custom Media');
    }
  );

  scenario(
    'start an activityTimer with media slug',
    async (scenario: StandardScenario) => {
      const noTimer = scenario.user.noTimer as User;
      const media = scenario.media.movie as Media;

      mockCurrentUser({
        id: noTimer.id,
        email: noTimer.email,
        timezone: noTimer.timezone,
        name: noTimer.name,
      });

      const timer = await startActivityTimer({
        input: {
          activityType: 'WATCHING',
          languageId: noTimer.primaryLanguageId,
          mediaSlug: media.slug,
        },
      });

      expect(timer.mediaId).toEqual(media.id);
      expect(timer.customMediaId).toBeNull();
    }
  );

  scenario(
    'start an activityTimer with existing custom media',
    async (scenario: StandardScenario) => {
      const noTimer = scenario.user.noTimer as User;
      const customMedia = scenario.customMedia.existing as CustomMedia;

      mockCurrentUser({
        id: noTimer.id,
        email: noTimer.email,
        timezone: noTimer.timezone,
        name: noTimer.name,
      });

      const timer = await startActivityTimer({
        input: {
          activityType: 'WATCHING',
          languageId: noTimer.primaryLanguageId,
          mediaSlug: customMedia.slug,
        },
      });

      expect(timer.customMediaId).toEqual(customMedia.id);
      expect(timer.mediaId).toBeNull();
    }
  );

  scenario(
    'throws error when starting activity timer while theres an active timer',
    async (scenario: StandardScenario) => {
      const noEndTimer = scenario.activityTimer.noEnd as ActivityTimer;

      mockCurrentUser({
        id: noEndTimer.userId,
        email: 'String6072784',
        timezone: 'UTC',
        name: 'String',
      });

      await expect(
        startActivityTimer({
          input: {
            activityType: 'WATCHING',
            languageId: noEndTimer.languageId,
          },
        })
      ).rejects.toThrow('You already have an active timer');
    }
  );

  scenario(
    'throws error when starting activity timer with invalid media slug',
    async (scenario: StandardScenario) => {
      const noTimer = scenario.user.noTimer as User;

      mockCurrentUser({
        id: noTimer.id,
        email: noTimer.email,
        timezone: noTimer.timezone,
        name: noTimer.name,
      });

      await expect(
        startActivityTimer({
          input: {
            activityType: 'WATCHING',
            languageId: noTimer.primaryLanguageId,
            mediaSlug: 'invalid-slug',
          },
        })
      ).rejects.toThrow('Selected media not found');
    }
  );

  scenario(
    'throws error when starting activity timer with invalid language',
    async (scenario: StandardScenario) => {
      const noTimer = scenario.user.noTimer as User;

      mockCurrentUser({
        id: noTimer.id,
        email: noTimer.email,
        timezone: noTimer.timezone,
        name: noTimer.name,
      });

      await expect(
        startActivityTimer({
          input: {
            activityType: 'WATCHING',
            languageId: 9999,
          },
        })
      ).rejects.toThrow('Selected language is not added to your profile');
    }
  );

  scenario(
    'throws error when starting activity timer with invalid activity type',
    async (scenario: StandardScenario) => {
      const noTimer = scenario.user.noTimer as User;

      mockCurrentUser({
        id: noTimer.id,
        email: noTimer.email,
        timezone: noTimer.timezone,
        name: noTimer.name,
      });

      await expect(
        startActivityTimer({
          input: {
            activityType: 'INVALID_TYPE' as unknown as ActivityType,
            languageId: noTimer.primaryLanguageId,
          },
        })
      ).rejects.toThrow();
    }
  );

  scenario(
    'throws an error when language is not on user profile',
    async (scenario: StandardScenario) => {
      const invalidLangUser = scenario.user.invalidLang as User;

      mockCurrentUser({
        id: invalidLangUser.id,
        email: invalidLangUser.email,
        timezone: invalidLangUser.timezone,
        name: invalidLangUser.name,
      });

      await expect(
        startActivityTimer({
          input: {
            activityType: 'WATCHING',
            languageId: 999,
          },
        })
      ).rejects.toThrow('Selected language is not added to your profile');
    }
  );

  scenario(
    'throw error when custom media and media slug are both provided',
    async (scenario: StandardScenario) => {
      const noTimer = scenario.user.noTimer as User;

      mockCurrentUser({
        id: noTimer.id,
        email: noTimer.email,
        timezone: noTimer.timezone,
        name: noTimer.name,
      });

      await expect(
        startActivityTimer({
          input: {
            activityType: 'WATCHING',
            languageId: noTimer.primaryLanguageId,
            mediaSlug: 'some-slug',
            customMediaTitle: 'Some Title',
          },
        })
      ).rejects.toThrow('Cannot set both mediaSlug and customMediaTitle');
    }
  );
});

// describe('stop ActivityTimer', () => {
//   scenario('stop activity timer', () => {});
// });
