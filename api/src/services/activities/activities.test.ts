import { vi, describe, it, expect, beforeEach } from 'vitest';

import { db } from 'src/lib/db';

import { createActivity } from './activities';

const MOCK_USER = {
  id: 1,
  email: 'test@test.com',
  timezone: 'UTC',
};

vi.mock('@redwoodjs/context', () => ({
  context: {
    currentUser: MOCK_USER,
  },
}));

describe('activities service', () => {
  beforeEach(() => {
    // Clear database before each test
    vi.clearAllMocks();
  });

  describe('createActivity', () => {
    it('creates an activity with custom media', async () => {
      const mockDate = new Date('2024-01-01T00:00:00Z');

      // Mock user with language access
      await db.user.create({
        data: {
          id: 1,
          email: 'test@test.com',
          timezone: 'UTC',
          languages: {
            create: {
              id: 1,
              code: 'en',
              name: 'English',
            },
          },
        },
      });

      const result = await createActivity({
        input: {
          date: mockDate,
          activityType: 'WATCHING',
          duration: 30,
          languageId: 1,
          customMediaTitle: 'My Custom Media',
        },
      });

      // Check custom media was created
      const customMedia = await db.customMedia.findFirst({
        where: { title: 'My Custom Media', userId: MOCK_USER.id },
      });
      expect(customMedia).toBeTruthy();
      expect(customMedia.slug).toMatch(/^my-custom-media-[a-z0-9]{4}$/);

      // Check activity was created with custom media
      expect(result).toEqual(
        expect.objectContaining({
          activityType: 'WATCHING',
          duration: 30,
          languageId: 1,
          customMediaId: customMedia.id,
          userId: MOCK_USER.id,
        })
      );
    });

    it('fails if custom media title already exists', async () => {
      const mockDate = new Date('2024-01-01T00:00:00Z');

      // Create an existing custom media
      await db.customMedia.create({
        data: {
          title: 'Existing Media',
          slug: 'existing-media',
          userId: MOCK_USER.id,
        },
      });

      await expect(
        createActivity({
          input: {
            date: mockDate,
            activityType: 'WATCHING',
            duration: 30,
            languageId: 1,
            customMediaTitle: 'Existing Media',
          },
        })
      ).rejects.toThrow('You already have a media with this title');
    });

    it('creates an activity with existing media', async () => {
      const mockDate = new Date('2024-01-01T00:00:00Z');

      // Create an existing media
      const media = await db.media.create({
        data: {
          title: 'Existing TMDB Media',
          slug: 'existing-tmdb-media',
          externalId: 'tmdb-123',
          mediaType: 'MOVIE',
        },
      });

      const result = await createActivity({
        input: {
          date: mockDate,
          activityType: 'WATCHING',
          duration: 30,
          languageId: 1,
          mediaSlug: media.slug,
        },
      });

      expect(result).toEqual(
        expect.objectContaining({
          activityType: 'WATCHING',
          duration: 30,
          languageId: 1,
          mediaId: media.id,
          userId: MOCK_USER.id,
        })
      );
    });
  });
});
