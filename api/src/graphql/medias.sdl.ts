export const schema = gql`
  type Media {
    id: String!
    externalId: String!
    title: String!
    mediaType: MediaType!
    originalTitle: String
    description: String
    posterUrl: String
    backdropUrl: String
    popularity: Float
    releaseDate: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    MovieMetadata: MovieMetadata
    TvMetadata: TvMetadata
  }

  enum MediaType {
    MOVIE
    TV
    BOOK
  }

  type Query {
    medias: [Media!]! @requireAuth
    searchMedias(query: String!): [Media!] @skipAuth
  }

  input CreateMediaInput {
    externalId: String!
    title: String!
    mediaType: MediaType!
    originalTitle: String
    description: String
    posterUrl: String
    backdropUrl: String
    popularity: Float
    releaseDate: DateTime
  }

  input UpdateMediaInput {
    externalId: String
    title: String
    mediaType: MediaType
    originalTitle: String
    description: String
    posterUrl: String
    backdropUrl: String
    popularity: Float
    releaseDate: DateTime
  }
`;
