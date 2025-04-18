export const schema = gql`
  type CustomMedia {
    id: String!
    title: String!
    slug: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int
    User: User
    Activity: [Activity]
  }

  type Query {
    customMedias: [CustomMedia!]! @requireAuth
    customMedia(id: String!): CustomMedia @requireAuth
  }

  input CreateCustomMediaInput {
    title: String!
    slug: String!
    userId: Int!
  }

  input UpdateCustomMediaInput {
    title: String
    slug: String
    userId: Int
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
