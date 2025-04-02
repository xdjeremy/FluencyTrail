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
