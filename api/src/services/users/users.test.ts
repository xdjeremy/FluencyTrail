import { user } from './users';
import { StandardScenario } from './users.scenarios';

describe('user', () => {
  scenario(
    'returns a user when given a valid id',
    async (scenario: StandardScenario) => {
      const result = await user({ id: scenario.user.one.id });
      expect(result).toMatchObject({
        email: scenario.user.one.email,
        name: scenario.user.one.name,
        timezone: scenario.user.one.timezone,
      });
    }
  );

  scenario(
    'returns current user when no id provided',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.one);
      const result = await user({});
      expect(result).toMatchObject({
        email: scenario.user.one.email,
        name: scenario.user.one.name,
        timezone: scenario.user.one.timezone,
      });
    }
  );

  scenario(
    'throws error when no id provided and unauthenticated',
    async (_scenario: StandardScenario) => {
      mockCurrentUser(null);
      const fcn = async () => await user();
      await expect(fcn).rejects.toThrow();
    }
  );
});
