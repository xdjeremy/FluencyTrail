import { FindMediaQuery } from 'types/graphql';

// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */): FindMediaQuery => ({
  media: {
    __typename: 'Media' as const,
    id: '42',
    title: 'The Hitchhiker',
    description:
      "The Hitchhiker's Guide to the Galaxy is a comic science fiction series created by Douglas Adams.",
    originalTitle: "The Hitchhiker's Guide to the Galaxy",
    posterUrl: 'https://placehold.co/600x1200/png?text=Monds',
    popularity: 1234,
    releaseDate: '2005-04-29',
    mediaType: 'MOVIE',
    MovieMetadata: {
      originalLanguage: 'en',
      runtime: 120,
      genres: ['Comedy', 'Sci-Fi'],
    },
  },
});
