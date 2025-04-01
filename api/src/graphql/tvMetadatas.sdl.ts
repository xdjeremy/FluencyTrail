export const schema = gql`
  type TvMetadata {
    mediaId: String!
    adult: Boolean
    originalLanguage: String
    genres: [String]!
    firstAirDate: DateTime
    originalCountry: [String]!
    media: Media!
  }

  type Query {
    tvMetadatas: [TvMetadata!]! @requireAuth
    tvMetadata(mediaId: String!): TvMetadata @requireAuth
  }

  input CreateTvMetadataInput {
    mediaId: String!
    adult: Boolean
    originalLanguage: String
    genres: [String]!
    firstAirDate: DateTime
    originalCountry: [String]!
  }

  input UpdateTvMetadataInput {
    mediaId: String!
    adult: Boolean
    originalLanguage: String
    genres: [String]!
    firstAirDate: DateTime
    originalCountry: [String]!
  }

  type Mutation {
    createTvMetadata(input: CreateTvMetadataInput!): TvMetadata! @requireAuth
    updateTvMetadata(
      mediaId: String!
      input: UpdateTvMetadataInput!
    ): TvMetadata! @requireAuth
    deleteTvMetadata(mediaId: String!): TvMetadata! @requireAuth
  }
`;
