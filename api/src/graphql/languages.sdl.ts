export const schema = gql`
  type Language {
    id: Int!
    code: String!
    name: String!
    nativeName: String!
  }

  type Query {
    "Fetches all available languages"
    languages: [Language!]! @skipAuth # Usually public info
  }
`;
