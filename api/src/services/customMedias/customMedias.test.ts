import { createActivity } from '../activities/activities';
import { addUserLanguage } from '../users/users';

import {
  createCustomMedia,
  customMedia,
  customMedias,
  deleteCustomMedia,
  updateCustomMedia,
} from './customMedias';
import type { StandardScenario } from './customMedias.scenarios';

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('list customMedias', () => {
  scenario('returns all customMedias', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.customMedia.one.userId,
      email: 'String2369822',
      name: 'String2369822',
      timezone: 'UTC',
    });

    const result = await customMedias();

    expect(result.length).toEqual(1);
  });

  scenario('unauthorized user cannot list customMedias', async () => {
    const result = await customMedias();

    expect(result.length).toEqual(0);
  });
});

describe('create customMedia', () => {
  scenario('create a customMedia', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.customMedia.one.userId,
      email: 'String2369822',
      name: 'String2369822',
      timezone: 'UTC',
    });

    await createCustomMedia({
      input: {
        title: 'New Custom Media',
      },
    });

    const result = await customMedias();
    expect(result.length).toEqual(2);
  });

  scenario('throws errors when customMedia with invalid data', async () => {
    const fcn = async () =>
      await createCustomMedia({
        input: {
          title: '',
        },
      });
    await expect(fcn).rejects.toThrow();
  });

  scenario(
    'throws error when customMedia with existing title from same user',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.customMedia.one.userId,
        email: 'String236',
        name: 'String2369822',
        timezone: 'UTC',
      });

      const fcn = async () =>
        await createCustomMedia({
          input: { ...scenario.customMedia.one },
        });

      await expect(fcn).rejects.toThrow();
    }
  );

  scenario(
    'create customMedia with existing title from different user',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.customMedia.two.userId,
        email: 'String2369822',
        name: 'String2369822',
        timezone: 'UTC',
      });

      await createCustomMedia({
        input: {
          title: scenario.customMedia.one.title,
        },
      });

      const result = await customMedias();
      expect(result.length).toEqual(2);
    }
  );
});

describe('delete customMedia', () => {
  scenario('delete a customMedia', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.customMedia.one.userId,
      email: 'String2369822',
      name: 'String2369822',
      timezone: 'UTC',
    });

    const fcn = async () =>
      await deleteCustomMedia({ id: scenario.customMedia.one.id });

    expect(fcn).not.toThrow();

    const fcn2 = async () => await customMedias();

    expect(fcn2.length).toEqual(0);
  });

  scenario(
    'throws error when customMedia with invalid data',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.customMedia.one.userId,
        email: 'String2369822',
        name: 'String2369822',
        timezone: 'UTC',
      });

      const fcn = async () => await deleteCustomMedia({ id: '' });

      await expect(fcn).rejects.toThrow('ID is required');
    }
  );

  scenario(
    'throws an error when customMedia have an activity that depends on',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.customMedia.one.userId,
        email: 'String2369822',
        name: 'String2369822',
        timezone: 'UTC',
      });

      // add user language
      await addUserLanguage({
        input: {
          languageCode: 'gb',
        },
      });

      // create activity
      await createActivity({
        input: {
          date: '2025-04-20T16:15:04.385Z',
          mediaSlug: scenario.customMedia.one.slug,
          activityType: 'WATCHING',
          duration: 60,
          languageId: 1,
        },
      });

      const fcn = async () =>
        await deleteCustomMedia({ id: scenario.customMedia.one.id });

      await expect(fcn).rejects.toThrow();
    }
  );

  scenario(
    'throws error when customMedia ID does not exist',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.customMedia.one.userId,
        email: 'String2369822',
        name: 'String2369822',
        timezone: 'UTC',
      });

      const fcn = async () =>
        await deleteCustomMedia({ id: 'non-existing-id' });

      await expect(fcn).rejects.toThrow();
    }
  );

  scenario(
    'throws an error when customMedia Id does not belong to user',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.customMedia.one.userId,
        email: 'String2369822',
        name: 'String2369822',
        timezone: 'UTC',
      });

      const fcn = async () =>
        await deleteCustomMedia({ id: scenario.customMedia.two.id });

      await expect(fcn).rejects.toThrow();
    }
  );
});

describe('update customMedia', () => {
  scenario('update a customMedia', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.customMedia.one.userId,
      email: 'String2369822',
      name: 'String2369822',
      timezone: 'UTC',
    });

    const updated = await updateCustomMedia({
      id: scenario.customMedia.one.id,
      input: {
        title: 'Updated Custom Media',
      },
    });

    // Check immediate return value
    expect(updated.title).toEqual('Updated Custom Media');

    // Verify database record
    const result = await customMedia({ id: scenario.customMedia.one.id });
    expect(result?.title).toEqual('Updated Custom Media');
  });

  scenario(
    'throws error when customMedia with invalid data',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.customMedia.one.userId,
        email: 'String2369822',
        name: 'String2369822',
        timezone: 'UTC',
      });

      const fcn = async () =>
        await updateCustomMedia({
          id: scenario.customMedia.one.id,
          input: {
            title: '',
          },
        });
      await expect(fcn).rejects.toThrow();
    }
  );

  scenario(
    'throws error when customMedia ID does not exist',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.customMedia.one.userId,
        email: 'String2369822',
        name: 'String2369822',
        timezone: 'UTC',
      });

      const fcn = async () =>
        await updateCustomMedia({
          id: 'non-existing-id',
          input: {
            title: 'Updated Custom Media',
          },
        });
      await expect(fcn).rejects.toThrow();
    }
  );

  scenario(
    'throws error when customMedia ID does not belong to user',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.customMedia.one.userId,
        email: 'String2369822',
        name: 'String2369822',
        timezone: 'UTC',
      });

      const fcn = async () =>
        await updateCustomMedia({
          id: scenario.customMedia.two.id,
          input: {
            title: 'Updated Custom Media',
          },
        });
      await expect(fcn).rejects.toThrow();
    }
  );

  scenario(
    'throws error when customMedia with existing title from same user',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.customMedia.one.userId,
        email: 'String2369822',
        name: 'String2369822',
        timezone: 'UTC',
      });

      // create new custom media
      await createCustomMedia({
        input: {
          title: 'New Custom Media',
        },
      });

      // update custom media with existing title
      const fcn = async () =>
        await updateCustomMedia({
          id: scenario.customMedia.one.id,
          input: {
            title: 'New Custom Media',
          },
        });
      await expect(fcn).rejects.toThrow();
    }
  );

  scenario(
    'update customMedia with existing title from different user',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.customMedia.one.userId,
        email: 'String2369822',
        name: 'String2369822',
        timezone: 'UTC',
      });

      // update custom media with existing title
      const updated = await updateCustomMedia({
        id: scenario.customMedia.one.id,
        input: {
          title: scenario.customMedia.two.title,
        },
      });
      // Check immediate return value
      expect(updated.title).toEqual(scenario.customMedia.two.title);
    }
  );

  scenario('slug updates when updating', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.customMedia.one.userId,
      email: 'String2369822',
      name: 'String2369822',
      timezone: 'UTC',
    });

    const updated = await updateCustomMedia({
      id: scenario.customMedia.one.id,
      input: {
        title: 'Updated Custom Media',
      },
    });

    expect(updated.slug).not.toEqual(scenario.customMedia.one.slug);
  });
});
