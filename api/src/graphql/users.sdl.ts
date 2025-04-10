export const schema = gql`
  type User {
    id: Int!
    email: String!
    name: String!
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

  input UpdateUserPasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  type Mutation {
    confirmUserEmail(token: String!): User! @skipAuth
    editUser(input: EditUserInput!): User! @requireAuth
    updateUserPassword(input: UpdateUserPasswordInput!): User! @requireAuth
    deleteUser: User! @requireAuth
  }
`;
