export const schema = gql`
  type Media {
    id: String!
    externalId: String!
    slug: String!
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
    media(slug: String!): Media @skipAuth
    medias(query: String!): [Media!]! @skipAuth
    similarMedias(slug: String!): [Media!]! @skipAuth
  }
`;
