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
    CUSTOM # Added for unified search result
  }

  # Type for unified search results
  type SearchResultItem {
    id: String! # Can be Media ID or CustomMedia ID
    title: String!
    slug: String! # Media slug or CustomMedia ID (as slug isn't guaranteed)
    mediaType: MediaType! # Indicates if it's MOVIE, TV, BOOK, or CUSTOM
    posterUrl: String # Optional poster
    releaseDate: DateTime # Optional release date
  }

  type Query {
    media(slug: String!): Media @skipAuth
    medias(query: String!): [Media!]! @skipAuth
    similarMedias(slug: String!): [Media!]! @skipAuth

    # Unified search for the current user's standard and custom media
    searchMyContent(query: String!): [SearchResultItem!]! @requireAuth
  }
`;
