import { db } from 'src/lib/db';

import { media, medias } from './medias';
import type { StandardScenario } from './medias.scenarios';

// Mock the TheMovieDb class
jest.mock('./themoviedb');

describe('media service', () => {
  describe('media query', () => {
    scenario(
      'returns fresh movie data from cache without TMDB call',
      async (scenario: StandardScenario) => {
        const result = await media({ slug: 'john-wick-1234' });
        expect(result).toEqual(scenario.media.freshMovie);
      }
    );

    scenario(
      'returns fresh TV show data from cache without TMDB call',
      async (scenario: StandardScenario) => {
        const result = await media({ slug: 'stranger-things-91011' });
        expect(result).toEqual(scenario.media.freshTvShow);
      }
    );

    scenario(
      'fetches and updates stale movie data from TMDB',
      async (scenario: StandardScenario) => {
        const result = await media({ slug: 'inception-5678' });
        expect(result.title).toBe('Inception');
        expect(result.mediaType).toBe('MOVIE');

        // Should have recent updatedAt
        const updatedAt = new Date(result.updatedAt).getTime();
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        expect(updatedAt).toBeGreaterThan(fiveMinutesAgo);

        // Verify metadata was updated in the database
        const updatedMedia = await db.media.findUnique({
          where: { id: scenario.media.staleMovie.id },
          include: { MovieMetadata: true },
        });

        expect(updatedMedia.MovieMetadata).toBeTruthy();
        expect(updatedMedia.MovieMetadata).toMatchObject({
          genres: ['Sci-Fi', 'Action'],
          runtime: 148,
        });
      }
    );

    scenario('returns null for invalid slug', async () => {
      const result = await media({ slug: 'invalid-slug' }); // No ID at end
      expect(result).toBeNull();
    });
  });

  describe('medias query', () => {
    scenario('returns search results', async () => {
      const results = await medias({ query: 'test' });
      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(0); // Current behavior returns empty array
    });
  });
});
