import { gql } from 'graphql-tag';

export const CREATE_CUSTOM_MEDIA = gql`
  mutation CreateCustomMedia($input: CreateCustomMediaInput!) {
    createCustomMedia(input: $input) {
      id
      mediaId
      metadata
      user {
        id
      }
      media {
        id
        title
        slug
        mediaType
        externalId
        releaseDate
        posterUrl
        backdropUrl
        originalTitle
      }
    }
  }
`;
