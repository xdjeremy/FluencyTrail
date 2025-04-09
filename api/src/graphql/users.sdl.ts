export const schema = gql`
  type User {
    id: Int!
    email: String!
    name: String!
    emailVerified: Boolean
    timezone: String
    createdAt: DateTime
    updatedAt: DateTime
    Activity: [Activity]
  }

  type Query {
    # users: [User!]! @requireAuth
    user(id: Int): User @requireAuth
  }

  input EditUserInput {
    name: String
    timezone: String
  }

  type Mutation {
    confirmUserEmail(token: String!): User! @skipAuth
    editUser(input: EditUserInput!): User! @requireAuth
  }
`;
