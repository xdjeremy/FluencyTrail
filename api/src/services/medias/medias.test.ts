import { db } from 'src/lib/db';

import MediaManager from './mediamanager';
import { MediaTypeEnum } from './mediamanager/interfaces';
import { searchMedias, setMediaManager } from './medias';
import TheMovieDb from './themoviedb';
import { TmdbSearchMultiResponse } from './themoviedb/interfaces';

// Mock TheMovieDb
jest.mock('./themoviedb', () => {
  return jest.fn().mockImplementation(() => ({
    searchMulti: jest.fn(),
  }));
});

describe('medias', () => {
  let tmdbInstance;
  let mediaManager;

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
    scenario('returns combined results prioritizing CustomMedia', async () => {
      const mockTmdbResults: TmdbSearchMultiResponse = {
        page: 1,
        results: [
          {
            id: 1,
            media_type: 'movie',
            title: 'TMDB Movie',
            original_title: 'Original TMDB Movie',
            name: undefined,
            original_name: undefined,
            overview: 'Movie description',
            poster_path: '/path/to/poster.jpg',
            backdrop_path: '/path/to/backdrop.jpg',
            popularity: 100,
            release_date: '2024-01-01',
          },
          {
            id: 2,
            media_type: 'tv',
            title: undefined,
            original_title: undefined,
            name: 'TMDB TV Show',
            original_name: 'Original TMDB TV Show',
            overview: 'TV Show description',
            poster_path: '/path/to/poster.jpg',
            backdrop_path: '/path/to/backdrop.jpg',
            popularity: 90,
            first_air_date: '2024-01-01',
          },
        ],
        total_pages: 1,
        total_results: 2,
      };

      const mockCustomMedias = [
        {
          id: 'custom-1',
          title: 'Custom Media 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1,
        },
        {
          id: 'custom-2',
          title: 'Custom Media 2',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1,
        },
      ];

      tmdbInstance.searchMulti.mockResolvedValue(mockTmdbResults);
      jest
        .spyOn(db.customMedia, 'findMany')
        .mockResolvedValue(mockCustomMedias);

      const result = await searchMedias({ query: 'test' });

      expect(result).toHaveLength(4);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'custom-1',
          title: 'Custom Media 1',
          mediaType: 'BOOK' as MediaTypeEnum,
        })
      );
      expect(result[1]).toEqual(
        expect.objectContaining({
          id: 'custom-2',
          title: 'Custom Media 2',
          mediaType: 'BOOK' as MediaTypeEnum,
        })
      );
      expect(result[2]).toEqual(
        expect.objectContaining({
          id: 'tmdb-1',
          title: 'TMDB Movie',
          mediaType: 'MOVIE' as MediaTypeEnum,
        })
      );
      expect(result[3]).toEqual(
        expect.objectContaining({
          id: 'tmdb-2',
          title: 'TMDB TV Show',
          mediaType: 'TV' as MediaTypeEnum,
        })
      );
    });

    scenario('handles TMDB API failure gracefully', async () => {
      const mockCustomMedias = [
        {
          id: 'custom-1',
          title: 'Custom Media 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1,
        },
      ];

      tmdbInstance.searchMulti.mockRejectedValue(new Error('API Error'));
      jest
        .spyOn(db.customMedia, 'findMany')
        .mockResolvedValue(mockCustomMedias);

      const result = await searchMedias({ query: 'test' });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'custom-1',
          title: 'Custom Media 1',
          mediaType: 'BOOK' as MediaTypeEnum,
        })
      );
    });

    scenario('handles CustomMedia query failure gracefully', async () => {
      const mockTmdbResults: TmdbSearchMultiResponse = {
        page: 1,
        results: [
          {
            id: 1,
            media_type: 'movie',
            title: 'TMDB Movie',
            original_title: 'Original TMDB Movie',
            name: undefined,
            original_name: undefined,
            overview: 'Movie description',
            poster_path: '/path/to/poster.jpg',
            backdrop_path: '/path/to/backdrop.jpg',
            popularity: 100,
            release_date: '2024-01-01',
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      tmdbInstance.searchMulti.mockResolvedValue(mockTmdbResults);
      jest
        .spyOn(db.customMedia, 'findMany')
        .mockRejectedValue(new Error('DB Error'));

      const result = await searchMedias({ query: 'test' });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'tmdb-1',
          title: 'TMDB Movie',
          mediaType: 'MOVIE' as MediaTypeEnum,
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
      const mockTmdbResults: TmdbSearchMultiResponse = {
        page: 1,
        results: Array(15)
          .fill(null)
          .map((_, i) => ({
            id: i,
            media_type: 'movie',
            title: `TMDB Movie ${i}`,
            original_title: `Original TMDB Movie ${i}`,
            name: undefined,
            original_name: undefined,
            overview: 'Movie description',
            poster_path: '/path/to/poster.jpg',
            backdrop_path: '/path/to/backdrop.jpg',
            popularity: 100,
            release_date: '2024-01-01',
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
      // Verify first results are from CustomMedia
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'custom-0',
          title: 'Custom Media 0',
          mediaType: 'BOOK' as MediaTypeEnum,
        })
      );
    });
  });
});
