import type { Activity } from '@prisma/client';
import { addDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { TimezoneConverter } from 'src/lib/TimezoneConverter';

import {
  activities,
  activity,
  createActivity,
  deleteActivity,
  heatMap,
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
    mockCurrentUser({
      id: scenario.activity.one.userId,
      name: 'John Doe',
      timezone: 'UTC', // Mock timezone for date validation
    });
    const result = await activities({
      itemsPerPage: 10,
      page: 1,
    });

    expect(result.length).toEqual(Object.keys(scenario.activity).length);
  });

  scenario('returns a single activity', async (scenario: StandardScenario) => {
    const result = await activity({ id: scenario.activity.one.id });

    expect(result).toEqual(scenario.activity.one);
  });

  scenario('creates a activity', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.activity.two.userId,
      name: 'John Doe',
      timezone: 'UTC', // Mock timezone for date validation
    });

    // Convert the ISO string from scenario to a Date object, simulating GraphQL scalar
    const inputDate = new Date(scenario.activity.two.date);

    const result = await createActivity({
      input: {
        activityType: scenario.activity.two.activityType,
        notes: scenario.activity.two.notes,
        duration: scenario.activity.two.duration,
        date: inputDate,
        mediaSlug: 'teasing-master-takagisan-235913-TV',
      },
    });

    // The service should store the UTC timestamp for midnight in the mocked timezone (UTC)
    const expectedDate = TimezoneConverter.userDateToUtc(
      formatInTimeZone(
        new Date(scenario.activity.two.date),
        'UTC',
        'yyyy-MM-dd'
      ),
      'UTC'
    );

    expect(result.userId).toEqual(scenario.activity.two.userId);
    expect(result.activityType).toEqual(scenario.activity.two.activityType);
    expect(result.notes).toEqual(scenario.activity.two.notes);
    expect(result.duration).toEqual(scenario.activity.two.duration);
    expect(result.date.getTime()).toEqual(expectedDate.getTime());
  });

  scenario(
    'creates activity with minimum required fields',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.activity.one.userId,
        name: 'John Doe',
        timezone: 'UTC',
      });

      // Convert the ISO string from scenario to a Date object
      const inputDate = new Date(scenario.activity.one.date);

      const result = await createActivity({
        input: {
          activityType: scenario.activity.one.activityType,
          date: inputDate,
          duration: scenario.activity.one.duration,
        },
      });

      // Calculate expected UTC midnight timestamp for the input date
      const expectedDate = TimezoneConverter.userDateToUtc(
        formatInTimeZone(
          new Date(scenario.activity.one.date),
          'UTC',
          'yyyy-MM-dd'
        ),
        'UTC'
      );

      expect(result.userId).toEqual(scenario.activity.one.userId);
      expect(result.activityType).toEqual(scenario.activity.one.activityType);
      expect(result.date.getTime()).toEqual(expectedDate.getTime());
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
        name: 'John Doe',
        timezone: 'UTC',
      });

      // Convert the ISO string from scenario to a Date object
      const inputDate = new Date(scenario.activity.one.date);

      await expect(() =>
        createActivity({
          input: {
            activityType: scenario.activity.one.activityType,
            date: inputDate,
            duration: scenario.activity.one.duration,
            mediaSlug: 'invalid-slug',
          },
        })
      ).rejects.toThrow('Media not found');
    }
  );

  scenario(
    'create an activity with invalid date format',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.activity.one.userId,
        name: 'John Doe',
        timezone: 'UTC',
      });

      const invalidDate = new Date('invalid'); // Will result in Invalid Date

      await expect(() =>
        createActivity({
          input: {
            activityType: scenario.activity.one.activityType,
            date: invalidDate,
            duration: scenario.activity.one.duration,
          },
        })
      ).rejects.toThrow('Invalid Date object received.');
    }
  );

  scenario(
    'create an activity with a future date',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.activity.one.userId,
        name: 'John Doe',
        timezone: 'UTC', // Mocked user timezone
      });

      // Create a Date object for tomorrow at UTC midnight
      const now = new Date();
      const tomorrow = addDays(now, 1);
      tomorrow.setUTCHours(0, 0, 0, 0); // Ensure UTC midnight

      await expect(() =>
        createActivity({
          input: {
            activityType: scenario.activity.one.activityType,
            date: tomorrow,
            duration: scenario.activity.one.duration,
          },
        })
      ).rejects.toThrow('Activity date cannot be in the future.');
    }
  );

  scenario(
    'create an activity with an invalid month',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.activity.one.userId,
        name: 'John Doe',
        timezone: 'UTC',
      });

      // Create an invalid Date object (month 13)
      const invalidDate = new Date('2023-13-01T00:00:00.000Z');

      await expect(() =>
        createActivity({
          input: {
            activityType: scenario.activity.one.activityType,
            date: invalidDate,
            duration: scenario.activity.one.duration,
          },
        })
      ).rejects.toThrow('Invalid Date object received.');
    }
  );

  scenario(
    'create an activity with an invalid leap date',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.activity.one.userId,
        name: 'John Doe',
        timezone: 'UTC',
      });

      // Note: new Date('2023-02-29') creates a valid Date (March 1st 2023)
      // because JavaScript automatically adjusts invalid dates
      const leapDate = new Date('2023-02-29T00:00:00.000Z');
      const result = await createActivity({
        input: {
          activityType: scenario.activity.one.activityType,
          date: leapDate,
          duration: scenario.activity.one.duration,
        },
      });

      // The date should have been automatically adjusted to March 1st
      expect(result.date.toISOString()).toBe('2023-03-01T00:00:00.000Z');
    }
  );

  // --- Update and Delete tests remain unchanged ---
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

  scenario(
    'correctly handles dates in heatmap',
    async (scenario: StandardScenario) => {
      const userTimeZone = 'Asia/Manila';
      const userId = scenario.activity.one.userId;

      mockCurrentUser({
        id: userId,
        name: 'Timezone Tester',
        timezone: userTimeZone,
      });

      // Create an activity with today's date
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Ensure consistent time portion

      await createActivity({
        input: {
          activityType: 'READING',
          date: today,
          duration: 30,
        },
      });

      // Get heatmap data and assert its shape
      type HeatMapEntry = {
        date: string;
        count: number;
      };
      const heatMapResult = await heatMap();

      // Get expected date string for today in Asia/Manila
      const expectedDateString = formatInTimeZone(
        today,
        userTimeZone,
        'yyyy/MM/dd'
      );

      // Find today's entry in the heatmap results
      const todayEntry = (heatMapResult as HeatMapEntry[]).find(
        entry => entry.date === expectedDateString
      );

      expect(todayEntry).toBeTruthy();
      expect(todayEntry?.count).toBe(30); // Duration we set
    }
  );
});
