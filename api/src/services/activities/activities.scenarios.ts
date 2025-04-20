import type { Language, Media, Prisma, User } from '@prisma/client'; // Import User

import type { ScenarioData } from '@redwoodjs/testing/api';

// Add explicit generic types and adjust data for CreateArgs compatibility
export const standard = defineScenario<
  Prisma.MediaCreateArgs | Prisma.LanguageCreateArgs | Prisma.UserCreateArgs, // Add UserCreateArgs
  'media' | 'language' | 'user', // Add 'user'
  'one'
>({
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
  language: {
    one: {
      data: {
        id: 1,
        name: 'English',
        code: 'gb',
        nativeName: 'English',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },
  // Add user scenario
  user: {
    one: {
      data: {
        id: 1,
        email: 'user1@example.com',
        name: 'User One',
        timezone: 'UTC',
        primaryLanguageId: 1, // Link to the primary language
        languages: {
          // Connect the user to the language defined above
          connect: { id: 1 },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },
});

// Update the type definition to include the user
export type StandardScenario = ScenarioData<
  Media | Language | User, // Add User
  'media' | 'language' | 'user' // Add 'user'
>;
