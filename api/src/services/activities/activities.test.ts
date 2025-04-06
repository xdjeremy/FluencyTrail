import type { Activity } from '@prisma/client';

import {
  activities,
  activity,
  createActivity,
  deleteActivity,
  updateActivity,
} from './activities';
import type { StandardScenario } from './activities.scenarios';

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('activities', () => {
  scenario('returns all activities', async (scenario: StandardScenario) => {
    const result = await activities();

    expect(result.length).toEqual(Object.keys(scenario.activity).length);
  });

  scenario('returns a single activity', async (scenario: StandardScenario) => {
    const result = await activity({ id: scenario.activity.one.id });

    expect(result).toEqual(scenario.activity.one);
  });

  scenario('creates a activity', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.activity.two.userId,
    });

    const result = await createActivity({
      input: {
        activityType: scenario.activity.two.activityType,
        notes: scenario.activity.two.notes,
        duration: scenario.activity.two.duration,
        date: scenario.activity.two.date,
        mediaSlug: 'teasing-master-takagisan-235913-TV',
      },
    });

    expect(result.userId).toEqual(scenario.activity.two.userId);
    expect(result.activityType).toEqual(scenario.activity.two.activityType);
    expect(result.notes).toEqual(scenario.activity.two.notes);
    expect(result.duration).toEqual(scenario.activity.two.duration);
    expect(result.date).toEqual(scenario.activity.two.date);
  });

  scenario(
    'creates activity with minimum required fields',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.activity.one.userId,
      });

      const result = await createActivity({
        input: {
          activityType: scenario.activity.one.activityType,
          date: scenario.activity.one.date,
          duration: scenario.activity.one.duration,
        },
      });

      expect(result.userId).toEqual(scenario.activity.one.userId);
      expect(result.activityType).toEqual(scenario.activity.one.activityType);
      expect(result.date).toEqual(scenario.activity.one.date);
      expect(result.duration).toEqual(scenario.activity.one.duration);
      expect(result.notes).toEqual(null);
      expect(result.mediaId).toEqual(null);
    }
  );

  scenario(
    'create activity with invaid slug',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.activity.one.userId,
      });

      await expect(() =>
        createActivity({
          input: {
            activityType: scenario.activity.one.activityType,
            date: scenario.activity.one.date,
            duration: scenario.activity.one.duration,
            mediaSlug: 'invalid-slug',
          },
        })
      ).rejects.toThrow('Media not found');
    }
  );

  scenario('updates a activity', async (scenario: StandardScenario) => {
    const original = (await activity({
      id: scenario.activity.one.id,
    })) as Activity;
    const result = await updateActivity({
      id: original.id,
      input: { activityType: 'OTHER' },
    });

    expect(result.activityType).toEqual('OTHER');
  });

  scenario('deletes a activity', async (scenario: StandardScenario) => {
    const original = (await deleteActivity({
      id: scenario.activity.one.id,
    })) as Activity;
    const result = await activity({ id: original.id });

    expect(result).toEqual(null);
  });
});
