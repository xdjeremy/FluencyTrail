export const schema = gql`
  type Activity {
    id: String!
    userId: Int!
    user: User!
    activityType: ActivityType!
    mediaId: String
    media: Media
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

  type HeatMap {
    date: String!
    count: Int!
  }

  type Streak {
    currentStreak: Int!
    bestStreak: Int!
  }

  type Query {
    activities: [Activity!]! @requireAuth
    activity(id: String!): Activity @requireAuth
    heatMap: [HeatMap!]! @requireAuth
    streak: Streak! @requireAuth
    completedToday: Boolean! @requireAuth
  }

  input CreateActivityInput {
    mediaSlug: String
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
`;
