export const schema = gql`
  type User {
    id: Int!
    email: String!
    name: String!
    timezone: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    Activity: [Activity]!

    "List of languages the user has added"
    languages: [Language!]! @requireAuth
    "The user's primary language for tracking and defaults"
    primaryLanguage: Language! @requireAuth
  }

  type UserStats {
    totalMinutes: Int!
    currentStreak: Int!
    longestStreak: Int!
  }

  type Query {
    # users: [User!]! @requireAuth
    user(id: Int): User @requireAuth
    "Fetches stats for a user, optionally filtered by language"
    userStats(userId: Int!, languageId: Int): UserStats! @requireAuth
  }

  input EditUserInput {
    name: String
    timezone: String!
  }

  input UpdateUserPasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  input AddUserLanguageInput {
    languageCode: String!
  }

  input RemoveUserLanguageInput {
    languageCode: String!
  }

  input SetPrimaryLanguageInput {
    languageCode: String!
  }

  type Mutation {
    confirmUserEmail(token: String!): User! @skipAuth
    editUser(input: EditUserInput!): User! @requireAuth
    updateUserPassword(input: UpdateUserPasswordInput!): User! @requireAuth
    deleteUser: User! @requireAuth

    "Adds a language to the current user's list"
    addUserLanguage(input: AddUserLanguageInput!): User! @requireAuth
    "Removes a language from the current user's list (cannot remove primary if others exist)"
    removeUserLanguage(input: RemoveUserLanguageInput!): User! @requireAuth
    "Sets one of the current user's added languages as their primary language"
    setPrimaryLanguage(input: SetPrimaryLanguageInput!): User! @requireAuth
  }
`;
