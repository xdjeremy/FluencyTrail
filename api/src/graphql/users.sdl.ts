export const schema = gql`
  type User {
    id: Int!
    email: String!
    emailVerified: Boolean!
    timezone: String # Added timezone field (nullable as it is in schema)
    createdAt: DateTime!
    updatedAt: DateTime!
    Activity: [Activity]!
  }

  # type Query {
  #   users: [User!]! @requireAuth
  #   user(id: Int!): User @requireAuth
  # }

  type Mutation {
    confirmUserEmail(token: String!): User! @skipAuth
  }
`;
