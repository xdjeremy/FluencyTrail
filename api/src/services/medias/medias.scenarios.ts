import type { Prisma, Media } from '@prisma/client';

import type { ScenarioData } from '@redwoodjs/testing/api';

export const standard = defineScenario<Prisma.MediaCreateArgs>({
  media: {
    freshMovie: {
      data: {
        slug: 'john-wick-1234',
        externalId: '1234',
        title: 'John Wick',
        mediaType: 'MOVIE',
        updatedAt: new Date().toISOString(),
        MovieMetadata: {
          create: {
            adult: false,
            originalLanguage: 'en',
            genres: ['Action', 'Thriller'],
            runtime: 120,
            rawData: { some: 'data' },
          },
        },
      },
    },
    staleMovie: {
      data: {
        slug: 'inception-5678',
        externalId: '5678',
        title: 'Inception',
        mediaType: 'MOVIE',
        updatedAt: new Date('2024-01-01').toISOString(), // Old data
        MovieMetadata: {
          create: {
            adult: false,
            originalLanguage: 'en',
            genres: ['Sci-Fi', 'Action'],
            runtime: 148,
            rawData: { some: 'data' },
          },
        },
      },
    },
    freshTvShow: {
      data: {
        slug: 'stranger-things-91011',
        externalId: '91011',
        title: 'Stranger Things',
        mediaType: 'TV',
        updatedAt: new Date().toISOString(),
        TvMetadata: {
          create: {
            adult: false,
            originalLanguage: 'en',
            genres: ['Drama', 'Horror'],
            firstAirDate: new Date('2016-07-15').toISOString(),
            originalCountry: ['US'],
          },
        },
      },
    },
    staleTvShow: {
      data: {
        slug: 'breaking-bad-1213',
        externalId: '1213',
        title: 'Breaking Bad',
        mediaType: 'TV',
        updatedAt: new Date('2024-01-01').toISOString(), // Old data
        TvMetadata: {
          create: {
            adult: false,
            originalLanguage: 'en',
            genres: ['Drama', 'Crime'],
            firstAirDate: new Date('2008-01-20').toISOString(),
            originalCountry: ['US'],
          },
        },
      },
    },
  },
});

export type StandardScenario = ScenarioData<Media, 'media'>;
