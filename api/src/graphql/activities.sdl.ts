export const schema = gql`
  type Activity {
    id: String!
    userId: Int!
    user: User!
    activityType: ActivityType!
    notes: String
    duration: Int
    date: DateTime!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum ActivityType {
    WATCHING
    READING
    LISTENING
    GRAMMAR
    VOCABULARY
    WRITING
    PLAYING
    OTHER
  }

  type Query {
    activities: [Activity!]! @requireAuth
    activity(id: String!): Activity @requireAuth
  }

  input CreateActivityInput {
    activityType: ActivityType!
    notes: String
    duration: Int
    date: DateTime!
  }

  input UpdateActivityInput {
    activityType: ActivityType
    notes: String
    duration: Int
    date: DateTime
  }

  type Mutation {
    createActivity(input: CreateActivityInput!): Activity! @requireAuth
    updateActivity(id: String!, input: UpdateActivityInput!): Activity!
      @requireAuth
    deleteActivity(id: String!): Activity! @requireAuth
  }
`
