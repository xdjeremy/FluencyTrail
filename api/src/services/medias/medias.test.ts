import type { ScenarioData } from '@redwoodjs/testing/api';

import { db } from 'src/lib/db';

import MediaManager from './mediamanager';
import { media, searchMedias, setMediaManager } from './medias';
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

  describe('media resolver', () => {
    scenario('returns existing media from database', async scenario => {
      const result = await media({ slug: scenario.media.one.slug });

      // Convert scenario media to expected GraphQL type
      expect(result).toMatchObject({
        id: scenario.media.one.id,
        slug: scenario.media.one.slug,
        title: scenario.media.one.title,
        mediaType: scenario.media.one.mediaType,
        externalId: scenario.media.one.externalId,
        originalTitle: scenario.media.one.originalTitle,
        description: scenario.media.one.description,
        posterUrl: scenario.media.one.posterUrl,
        backdropUrl: scenario.media.one.backdropUrl,
        popularity: scenario.media.one.popularity,
        date: scenario.media.one.releaseDate,
        MovieMetadata: undefined,
        TvMetadata: undefined,
      });
    });

    scenario('fetches and saves new media from TMDB', async () => {
      const mockMedia = {
        id: 'tmdb-123',
        slug: 'tmdb-movie-123',
        title: 'Test Movie',
        mediaType: 'MOVIE',
        externalId: '123',
        originalTitle: 'Test Movie',
        description: 'Test description',
        posterUrl: 'https://test.com/poster.jpg',
        backdropUrl: 'https://test.com/backdrop.jpg',
        popularity: 7.5,
        date: new Date('2024-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
        MovieMetadata: undefined,
        TvMetadata: undefined,
      };

      jest.spyOn(mediaManager, 'getMediaBySlug').mockResolvedValue(mockMedia);

      const result = await media({ slug: 'tmdb-movie-123' });
      expect(result).toEqual(mockMedia);
      expect(mediaManager.getMediaBySlug).toHaveBeenCalledWith(
        'tmdb-movie-123'
      );
    });

    scenario('returns null for non-existent media', async () => {
      jest.spyOn(mediaManager, 'getMediaBySlug').mockResolvedValue(null);

      const result = await media({ slug: 'non-existent-slug' });
      expect(result).toBeNull();
    });
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
