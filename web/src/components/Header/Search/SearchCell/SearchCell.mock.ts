import { SearchMediaByQuery } from 'types/graphql';

// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */): SearchMediaByQuery => ({
  medias: [
    {
      __typename: 'Media' as const,
      id: '42',
      title: 'Star Wars: Episode IV - A New Hope',
      mediaType: 'MOVIE',
      description: 'The first episode of the Star Wars saga.',
      releaseDate: '1977-05-25',
    },
    {
      __typename: 'Media' as const,
      id: '43',
      title: 'Star Wars: Episode V - The Empire Strikes Back',
      mediaType: 'MOVIE',
      description: 'The second episode of the Star Wars saga.',
      releaseDate: '1980-05-21',
    },
    {
      __typename: 'Media' as const,
      id: '44',
      title: 'Star Wars: Episode VI - Return of the Jedi',
      mediaType: 'MOVIE',
      description: 'The third episode of the Star Wars saga.',
      releaseDate: '1983-05-25',
    },
  ],
});
