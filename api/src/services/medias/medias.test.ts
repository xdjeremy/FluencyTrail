import type { ScenarioData } from '@redwoodjs/testing/api';

import { db } from 'src/lib/db';

import MediaManager from './mediamanager';
import { searchMedias, setMediaManager } from './medias';
import { standard, tmdbSearchResults } from './medias.scenarios';
import TheMovieDb from './themoviedb';

// Mock TheMovieDb
jest.mock('./themoviedb', () => {
  return jest.fn().mockImplementation(() => ({
    searchMulti: jest.fn(),
  }));
});

describe('medias', () => {
  let tmdbInstance;
  let mediaManager;

  type StandardScenario = ScenarioData<typeof standard>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Get the mocked constructor
    const MockedTheMovieDb = TheMovieDb as jest.MockedClass<typeof TheMovieDb>;

    // Create a new instance for each test
    tmdbInstance = new MockedTheMovieDb();

    // Create a new MediaManager with mocked TMDB client
    mediaManager = new MediaManager(tmdbInstance);

    // Set the mocked MediaManager for testing
    setMediaManager(mediaManager);

    // Reset the spies
    jest.spyOn(db.customMedia, 'findMany').mockReset();
  });

  describe('searchMedias', () => {
    scenario(
      'returns combined results with correct dates',
      async (_scenario: StandardScenario) => {
        const mockTmdbResults = {
          page: 1,
          results: [tmdbSearchResults.movie, tmdbSearchResults.tv],
          total_pages: 1,
          total_results: 2,
        };

        const mockCustomMedia = {
          id: 'custom-1',
          title: 'Custom Book 1',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          userId: 1,
        };

        tmdbInstance.searchMulti.mockResolvedValue(mockTmdbResults);
        jest
          .spyOn(db.customMedia, 'findMany')
          .mockResolvedValue([mockCustomMedia]);

        const result = await searchMedias({ query: 'test' });

        expect(result).toHaveLength(3);
        expect(result[0]).toEqual(
          expect.objectContaining({
            id: 'custom-1',
            title: 'Custom Book 1',
            mediaType: 'CUSTOM',
            date: new Date('2024-01-01'),
          })
        );
        expect(result[1]).toEqual(
          expect.objectContaining({
            id: 'tmdb-11070',
            slug: 'tmdb-movie-11070',
            title: 'Moonlight Tariff',
            mediaType: 'MOVIE',
            date: new Date('2024-01-01'),
          })
        );
        expect(result[2]).toEqual(
          expect.objectContaining({
            id: 'tmdb-38634',
            slug: 'tmdb-tv-38634',
            title: 'Bloody Monday',
            mediaType: 'TV',
            date: new Date('2024-01-01'),
          })
        );
      }
    );

    scenario('handles missing dates correctly', async () => {
      const mockTmdbResults = {
        page: 1,
        results: [tmdbSearchResults.withoutDates],
        total_pages: 1,
        total_results: 1,
      };

      tmdbInstance.searchMulti.mockResolvedValue(mockTmdbResults);
      jest.spyOn(db.customMedia, 'findMany').mockResolvedValue([]);

      const result = await searchMedias({ query: 'test' });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'tmdb-999',
          slug: 'tmdb-movie-999',
          title: 'No Date Movie',
          mediaType: 'MOVIE',
          date: undefined,
        })
      );
    });

    scenario('handles TMDB API failure gracefully', async () => {
      const mockCustomMedia = {
        id: 'custom-1',
        title: 'Custom Book 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1,
      };

      tmdbInstance.searchMulti.mockRejectedValue(new Error('API Error'));
      jest
        .spyOn(db.customMedia, 'findMany')
        .mockResolvedValue([mockCustomMedia]);

      const result = await searchMedias({ query: 'test' });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'custom-1',
          title: 'Custom Book 1',
          mediaType: 'CUSTOM',
        })
      );
    });

    scenario('returns empty array if both sources fail', async () => {
      tmdbInstance.searchMulti.mockRejectedValue(new Error('API Error'));
      jest
        .spyOn(db.customMedia, 'findMany')
        .mockRejectedValue(new Error('DB Error'));

      const result = await searchMedias({ query: 'test' });

      expect(result).toEqual([]);
    });

    scenario('limits total results to 10', async () => {
      const mockTmdbResults = {
        page: 1,
        results: Array(15)
          .fill(null)
          .map((_, i) => ({
            ...tmdbSearchResults.movie,
            id: i,
            title: `TMDB Movie ${i}`,
          })),
        total_pages: 1,
        total_results: 15,
      };

      const mockCustomMedias = Array(15)
        .fill(null)
        .map((_, i) => ({
          id: `custom-${i}`,
          title: `Custom Media ${i}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1,
        }));

      tmdbInstance.searchMulti.mockResolvedValue(mockTmdbResults);
      jest
        .spyOn(db.customMedia, 'findMany')
        .mockResolvedValue(mockCustomMedias);

      const result = await searchMedias({ query: 'test' });

      expect(result).toHaveLength(10);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'custom-0',
          title: 'Custom Media 0',
          mediaType: 'CUSTOM',
        })
      );
    });
  });
});
