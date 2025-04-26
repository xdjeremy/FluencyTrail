import type { ActivityTimer, User } from '@prisma/client';

import { activeTimer } from './activityTimers';
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
        email: 'String6072784',
        timezone: 'UTC',
        name: 'String',
      });

      const result = await activeTimer();
      expect(result).toEqual(null);
    }
  );
});

// describe('Start ActivityTimer', () => {
//   scenario('start an activityTimer', async (scenario: StandardScenario) => {});
// });

// describe('stop ActivityTimer', () => {
//   scenario('stop activity timer', () => {});
// });
