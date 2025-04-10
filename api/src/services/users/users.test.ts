import { deleteUser, editUser, user } from './users';
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

describe('editUser', () => {
  scenario('edits a user', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one);
    const result = await editUser({
      input: {
        name: scenario.user.two.name,
        timezone: scenario.user.two.timezone,
      },
    });

    expect(result).toMatchObject({
      email: scenario.user.one.email,
      name: scenario.user.two.name,
      timezone: scenario.user.two.timezone,
    });
  });

  scenario(
    'throws error when invalid timezone provided',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.one);
      await expect(
        editUser({
          input: {
            name: scenario.user.two.name,
            timezone: 'invalid-timezone',
          },
        })
      ).rejects.toThrow();
    }
  );

  scenario(
    'throws error when invalid name provided',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.one);

      await expect(
        editUser({
          input: {
            name: 'a',
            timezone: scenario.user.two.timezone,
          },
        })
      ).rejects.toThrow();
    }
  );
});

describe('deleteUser', () => {
  scenario('deletes a user', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one);
    await deleteUser();

    const result = await user({
      id: scenario.user.one.id,
    });

    expect(result).toBeNull();
  });
});
