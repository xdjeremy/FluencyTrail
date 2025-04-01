export const schema = gql`
  type MovieMetadata {
    mediaId: String!
    adult: Boolean
    originalLanguage: String
    genres: [String]!
    runtime: Int
    rawData: JSON!
    media: Media!
  }

  type Query {
    movieMetadatas: [MovieMetadata!]! @requireAuth
  }

  input CreateMovieMetadataInput {
    mediaId: String!
    adult: Boolean
    originalLanguage: String
    genres: [String]!
    runtime: Int
    rawData: JSON!
  }

  input UpdateMovieMetadataInput {
    mediaId: String!
    adult: Boolean
    originalLanguage: String
    genres: [String]!
    runtime: Int
    rawData: JSON
  }
`;
