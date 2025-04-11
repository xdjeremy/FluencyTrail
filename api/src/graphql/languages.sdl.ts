export const schema = gql`
  type Language {
    id: Int!
    code: String!
    name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    "Fetches all available languages"
    languages: [Language!]! @skipAuth # Usually public info
  }
`;
