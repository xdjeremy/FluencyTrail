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

  type TotalTime {
    totalTime: Int!
    vsLastWeek: Int!
  }

  type Query {
    activities(itemsPerPage: Int, page: Int, userId: Int): [Activity!]!
      @requireAuth
    activity(id: String!): Activity @requireAuth
    heatMap: [HeatMap!]! @requireAuth
    streak: Streak! @requireAuth
    completedToday: Boolean! @requireAuth
    totalTime: TotalTime! @requireAuth
  }

  input CreateActivityInput {
    mediaSlug: String
    activityType: ActivityType!
    notes: String
    duration: Int
    date: Date! # Changed from DateTime! to Date!
  }

  type Mutation {
    createActivity(input: CreateActivityInput!): Activity! @requireAuth
    deleteActivity(id: String!): Activity! @requireAuth
  }
`;
