import { gql } from 'graphql-tag';

export const schema = gql`
  type CustomMedia {
    id: String!
    media: Media!
    mediaId: String!
    user: User!
    userId: Int!
    metadata: JSON!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateCustomMediaInput {
    mediaId: String!
    metadata: JSON!
  }

  input UpdateCustomMediaInput {
    metadata: JSON
  }

  type Query {
    customMedias: [CustomMedia!]! @requireAuth
    customMedia(id: String!): CustomMedia @requireAuth
    myCustomMedias(query: String): [CustomMedia!]! @requireAuth
  }

  type Mutation {
    createCustomMedia(input: CreateCustomMediaInput!): CustomMedia! @requireAuth
    updateCustomMedia(
      id: String!
      input: UpdateCustomMediaInput!
    ): CustomMedia! @requireAuth
    deleteCustomMedia(id: String!): CustomMedia! @requireAuth
  }
`;
