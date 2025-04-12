import { GetUserLanguagesForLanguageSelector } from 'types/graphql';

// Define your own mock data here:
export const standard =
  (/* vars, { ctx, req } */): GetUserLanguagesForLanguageSelector => ({
    user: {
      __typename: 'User' as const,
      languages: [
        {
          id: 1,
          name: 'English',
          __typename: 'Language' as const,
        },
        {
          id: 2,
          name: 'Spanish',
          __typename: 'Language' as const,
        },
        {
          id: 3,
          name: 'French',
          __typename: 'Language' as const,
        },
      ],
      primaryLanguage: {
        id: 1,
        __typename: 'Language' as const,
      },
    },
  });
