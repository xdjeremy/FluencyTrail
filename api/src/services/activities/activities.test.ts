import type { Activity } from '@prisma/client';
import { vi, describe, test, expect, beforeEach } from 'vitest';

import { db } from 'src/lib/db';

const mockContext = {
  context: {
    currentUser: {
      id: 1,
      email: 'test@example.com',
      timezone: 'UTC',
    },
  },
};

vi.mock('@redwoodjs/context', () => mockContext);

import {
  activities as listActivities,
  createActivity,
  activity as getActivity,
} from './activities';
import type { StandardScenario } from './activities.scenarios';

describe('activities', () => {
  beforeEach(async () => {
    // Clear database
    await db.$transaction([
      db.activity.deleteMany(),
      db.customMedia.deleteMany(),
      db.media.deleteMany(),
      db.language.deleteMany(),
      db.user.deleteMany(),
    ]);

    // Create test user with language
    await db.user.create({
      data: {
        id: 1,
        email: 'test@example.com',
        timezone: 'UTC',
        hashedPassword: 'dummy',
        salt: 'dummy',
        languages: {
          create: {
            id: 1,
            code: 'en',
            name: 'English',
          },
        },
      },
    });
  });

  test('creates a new activity with TMDB media', async () => {
    // Create test media
    const media = await db.media.create({
      data: {
        title: 'Test Movie',
        slug: 'test-movie',
        externalId: 'tmdb-123',
        mediaType: 'MOVIE',
      },
    });

    const result = await createActivity({
      input: {
        activityType: 'WATCHING',
        date: new Date('2025-04-18T00:00:00Z'),
        duration: 30,
        languageId: 1,
        mediaSlug: media.slug,
      },
    });

    expect(result.activityType).toBe('WATCHING');
    expect(result.duration).toBe(30);
    expect(result.mediaId).toBe(media.id);
    expect(result.customMediaId).toBeNull();
  });

  test('creates a new activity with custom media', async () => {
    const result = await createActivity({
      input: {
        activityType: 'WATCHING',
        date: new Date('2025-04-18T00:00:00Z'),
        duration: 45,
        languageId: 1,
        customMediaTitle: 'New Custom Show',
      },
    });

    expect(result.activityType).toBe('WATCHING');
    expect(result.duration).toBe(45);
    expect(result.mediaId).toBeNull();
    expect(result.customMediaId).toBeTruthy();

    // Verify custom media was created
    const customMedia = await db.customMedia.findFirst({
      where: { title: 'New Custom Show' },
    });
    expect(customMedia).toBeTruthy();
    expect(customMedia.userId).toBe(1);
  });

  test('creates a new activity without media', async () => {
    const result = await createActivity({
      input: {
        activityType: 'GRAMMAR',
        date: new Date('2025-04-18T00:00:00Z'),
        duration: 15,
        languageId: 1,
      },
    });

    expect(result.activityType).toBe('GRAMMAR');
    expect(result.duration).toBe(15);
    expect(result.mediaId).toBeNull();
    expect(result.customMediaId).toBeNull();
  });

  test('fails if both media types are provided', async () => {
    await db.media.create({
      data: {
        title: 'Test Movie',
        slug: 'test-movie',
        externalId: 'tmdb-123',
        mediaType: 'MOVIE',
      },
    });

    await expect(
      createActivity({
        input: {
          activityType: 'WATCHING',
          date: new Date('2025-04-18T00:00:00Z'),
          duration: 30,
          languageId: 1,
          mediaSlug: 'test-movie',
          customMediaTitle: 'New Custom Show',
        },
      })
    ).rejects.toThrow('Cannot set both mediaSlug and customMediaTitle');
  });

  test('returns all activities', async (scenario: StandardScenario) => {
    const result = await listActivities({ languageId: null });
    const activityRecords = Object.values(scenario.activity);

    expect(result.length).toEqual(activityRecords.length);
    expect((result[0] as Activity).id).toEqual(
      (activityRecords[0] as Activity).id
    );
  });

  test('fails if user does not have access to language', async () => {
    // Create a language that user doesn't have access to
    const language = await db.language.create({
      data: {
        id: 2,
        code: 'ja',
        name: 'Japanese',
      },
    });

    await expect(
      createActivity({
        input: {
          activityType: 'GRAMMAR',
          date: new Date('2025-04-18T00:00:00Z'),
          duration: 15,
          languageId: language.id,
        },
      })
    ).rejects.toThrow('Selected language is not added to your profile');
  });

  test('handles user timezone when creating activity', async () => {
    // Temporarily override the timezone
    const originalTimezone = mockContext.context.currentUser.timezone;
    mockContext.context.currentUser.timezone = 'Asia/Tokyo';

    try {
      const result = await createActivity({
        input: {
          activityType: 'GRAMMAR',
          date: new Date('2025-04-18T00:00:00+09:00'), // Tokyo time
          duration: 15,
          languageId: 1,
        },
      });

      // Date should be stored in UTC
      expect(result.date.toISOString()).toBe('2025-04-17T15:00:00.000Z');
    } finally {
      // Restore original timezone
      mockContext.context.currentUser.timezone = originalTimezone;
    }
  });

  test('returns a single activity', async (scenario: StandardScenario) => {
    const result = await getActivity({
      id: scenario.activity.withTMDBMedia.id,
    });
    const activityRecord = scenario.activity.withTMDBMedia;

    expect((result as Activity).id).toEqual((activityRecord as Activity).id);
  });
});
