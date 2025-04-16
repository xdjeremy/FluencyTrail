import type { ScenarioData } from '@redwoodjs/testing/api';

export const standard = defineScenario({
  media: {
    one: {
      data: {
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
        releaseDate: new Date('2024-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSyncedAt: new Date(),
        ttl: 2592000,
      },
    },
  },
});

export const tmdbSearchResults = {
  movie: {
    id: 11070,
    media_type: 'movie',
    title: 'Moonlight Tariff',
    original_title: 'Original Moonlight Tariff',
    overview: 'Movie description',
    poster_path: '/path/to/poster.jpg',
    backdrop_path: '/path/to/backdrop.jpg',
    popularity: 100,
    release_date: '2024-01-01',
  },
  tv: {
    id: 38634,
    media_type: 'tv',
    name: 'Bloody Monday',
    original_name: 'Original Bloody Monday',
    overview: 'TV Show description',
    poster_path: '/path/to/poster.jpg',
    backdrop_path: '/path/to/backdrop.jpg',
    popularity: 90,
    first_air_date: '2024-01-01',
  },
  withoutDates: {
    id: 999,
    media_type: 'movie',
    title: 'No Date Movie',
    original_title: 'Original No Date Movie',
    overview: 'Movie without dates',
    poster_path: null,
    backdrop_path: null,
    popularity: 50,
  },
} as const;

type StandardScenario = ScenarioData<typeof standard>;
export type { StandardScenario };
