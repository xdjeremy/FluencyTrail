import type { ActivityTimer, User } from '@prisma/client';

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

  // scenario(
  //   'start an activityTimer with new custom media',
  //   async (scenario: StandardScenario) => {}
  // );

  // scenario(
  //   'start an activityTimer with media slug',
  //   async (scenario: StandardScenario) => {}
  // );

  // scenario(
  //   'start an activityTimer with existing custom media',
  //   async (scenario: StandardScenario) => {}
  // );

  // scenario(
  //   'throws error when starting activity timer while theres an active timer',
  //   async (scenario: StandardScenario) => {}
  // );

  // scenario(
  //   'throws error when starting activity timer with invalid media slug',
  //   async (scenario: StandardScenario) => {}
  // );

  // scenario(
  //   'throws error when starting activity timer with invalid custom media',
  //   async (scenario: StandardScenario) => {}
  // );

  // scenario(
  //   'throws error when starting activity timer with invalid language',
  //   async (scenario: StandardScenario) => {}
  // );

  // scenario(
  //   'throws error when starting activity timer with invalid activity type',
  //   async (scenario: StandardScenario) => {}
  // );

  // scenario(
  //   'throws error when starting activity timer with invalid custom media title',
  //   async (scenario: StandardScenario) => {}
  // );

  // scenario('throws an error when language is not on user profile', () => {});
});

// describe('stop ActivityTimer', () => {
//   scenario('stop activity timer', () => {});
// });
